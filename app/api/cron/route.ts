import { supabaseAdmin } from "@/lib/supabase/admin";
import { emailEnabled, sendOnce } from "@/lib/email";
import { siteUrl } from "@/lib/growth";
import { usd } from "@/lib/cn";
import type { ReportResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const H = 3600_000;
const D = 24 * H;

/**
 * One Vercel cron a day (the free plan allows one) sends what is due. Each email goes once (email_log).
 * Vercel sends "Authorization: Bearer $CRON_SECRET".
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Not found", { status: 404 });
  if (!emailEnabled()) return Response.json({ ok: true, skipped: "no RESEND_API_KEY" });

  const db = supabaseAdmin();
  const now = Date.now();
  const site = siteUrl();
  const sent: Record<string, number> = { welcome: 0, waiting_1h: 0, waiting_24h: 0, winback: 0, recap: 0 };

  const { data: profiles } = await db.from("profiles").select("id, email, name, created_at, last_plan, email_opt_out").eq("email_opt_out", false).not("email", "is", null).limit(5000);
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  const isPaid = (p: { last_plan: unknown }) => Boolean((p.last_plan as { paid?: boolean } | null)?.paid);

  // 1. Welcome with their leak report (accounts from the last 3 days with a report).
  const recent = (profiles ?? []).filter((p) => now - Date.parse(p.created_at) < 3 * D);
  for (const p of recent) {
    const { data: rep } = await db.from("reports").select("id, result").eq("user_id", p.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!rep?.result) continue;
    const r = rep.result as ReportResult;
    const n = (r.leaks?.length ?? 0) + (r.fees?.length ?? 0);
    const first = r.leaks?.[0]?.merchant;
    const ok = await sendOnce({ id: p.id, email: p.email! }, "welcome", "1", {
      subject: "Your leak report is ready",
      title: "Your leak report is ready.",
      lines: [
        n > 0 ? `We found ${n} recurring ${n === 1 ? "charge" : "charges"} in ${r.bank || "your statement"}${first ? ` — ${first} is just one of them.` : "."}` : `We read all ${r.transactions_count} transactions in your statement.`,
        isPaid(p) ? `Total: ${usd(r.monthly_leaks)} a month, ${usd(r.yearly_leaks, 0)} a year. Cancel what you don't use and watch your savings stack up.` : "It's saved in your account and waits for you.",
      ],
      button: "See my leak report",
      href: `${site}/reports/${rep.id}`,
    });
    if (ok) sent.welcome++;
  }

  // 2. "Your leak report is waiting": 1 hour and 24 hours after a paywall view without payment.
  const { data: views } = await db.from("events").select("user_id, created_at").eq("type", "paywall_view").gte("created_at", new Date(now - 3 * D).toISOString()).not("user_id", "is", null);
  const lastView = new Map<string, number>();
  for (const v of views ?? []) lastView.set(v.user_id!, Math.max(lastView.get(v.user_id!) ?? 0, Date.parse(v.created_at)));
  for (const [uid, at] of lastView) {
    const p = byId.get(uid);
    if (!p || isPaid(p)) continue;
    const age = now - at;
    const kind = age >= D ? "waiting_24h" : age >= H ? "waiting_1h" : null;
    if (!kind) continue;
    const ok = await sendOnce({ id: uid, email: p.email! }, kind, new Date(at).toISOString().slice(0, 10), {
      subject: "Your leak report is waiting",
      title: "Your leak report is waiting.",
      lines: [
        "Every forgotten subscription in your statement, the monthly total and the steps to cancel each one are one tap away.",
        "Plans start at a few cents a day, and you can cancel in 2 taps.",
      ],
      button: "See my full leak report",
      href: `${site}/dashboard`,
    });
    if (ok) sent[kind]++;
  }

  // 3. Win-back, 7 days after a cancellation.
  const { data: cancels } = await db.from("events").select("id, user_id, created_at").eq("type", "cancelled").lte("created_at", new Date(now - 7 * D).toISOString()).gte("created_at", new Date(now - 14 * D).toISOString());
  for (const c of cancels ?? []) {
    const p = c.user_id ? byId.get(c.user_id) : null;
    if (!p) continue;
    const ok = await sendOnce({ id: p.id, email: p.email! }, "winback", String(c.id), {
      subject: "New leak spotted? Check this month's statement",
      title: "Leaks come back quietly.",
      lines: [
        "A free trial that turned paid, a price hike, a fee your bank added. Your new statement is probably out.",
        "Your past reports are still in your account. Scan this month's PDF to see what changed.",
      ],
      button: "Scan my new statement",
      href: `${site}/upload`,
    });
    if (ok) sent.winback++;
  }

  // 4. Weekly recap, on Mondays: what they did this week.
  if (new Date(now).getUTCDay() === 1) {
    const week = new Date(now).toISOString().slice(0, 10);
    const since = new Date(now - 7 * D).toISOString();
    const { data: acts } = await db.from("leak_actions").select("user_id, monthly, status, updated_at").eq("status", "cancelled");
    const { data: reps } = await db.from("reports").select("user_id").gte("created_at", since).not("user_id", "is", null);
    for (const p of (profiles ?? []).filter(isPaid)) {
      const mine = (acts ?? []).filter((a) => a.user_id === p.id);
      const saved = mine.reduce((s, a) => s + Number(a.monthly), 0);
      const thisWeek = mine.filter((a) => a.updated_at >= since).length;
      const scans = (reps ?? []).filter((r) => r.user_id === p.id).length;
      const ok = await sendOnce({ id: p.id, email: p.email! }, "recap", week, {
        subject: saved > 0 ? `You're saving ${usd(saved)} a month` : "Your week with Budgeto",
        title: saved > 0 ? `${usd(saved)} a month saved so far.` : "Your week with Budgeto.",
        lines: [
          `This week: ${scans} ${scans === 1 ? "statement" : "statements"} scanned, ${thisWeek} ${thisWeek === 1 ? "leak" : "leaks"} cancelled.`,
          saved > 0 ? `That's ${usd(saved * 12, 0)} a year back in your pocket.` : "Scan your latest statement: it takes seconds and shows anything new.",
        ],
        button: "Open Budgeto",
        href: `${site}/dashboard`,
      });
      if (ok) sent.recap++;
    }
  }

  return Response.json({ ok: true, sent });
}
