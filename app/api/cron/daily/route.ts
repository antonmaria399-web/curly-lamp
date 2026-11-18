import { supabaseAdmin } from "@/lib/supabase/admin";
import { getPlan, getPlans } from "@/lib/kwop";
import { emailOn, sendOnce } from "@/lib/email";
import { SITE_URL } from "@/lib/seo";
import { usd } from "@/lib/cn";
import { json } from "@/lib/http";

export const runtime = "nodejs";
export const maxDuration = 60;

const H = 3600_000;
const D = 24 * H;

/**
 * One Vercel cron a day (the free plan allows one): sends the emails that are due. Each goes once (email_log).
 * - "Your leak report is waiting": after a paywall view without payment (first reminder within a day, second after 24 h).
 * - Win-back: 7 days after a cancellation.
 * - Weekly recap: on Mondays, to people who scanned or cancelled something in the last 7 days.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return json({ error: "unauthorized" }, 401);
  if (!emailOn()) return json({ ok: true, skipped: "no RESEND_API_KEY" });

  const db = supabaseAdmin();
  const now = Date.now();
  const sent: Record<string, number> = { waiting1: 0, waiting24: 0, winback: 0, recap: 0 };
  const { plans } = await getPlans();
  const cheapest = plans[0];

  // 1. Paywall seen, not paid.
  const { data: waiting } = await db
    .from("profiles")
    .select("id, email, paywall_seen_at")
    .not("paywall_seen_at", "is", null)
    .lt("paywall_seen_at", new Date(now - H).toISOString())
    .gt("paywall_seen_at", new Date(now - 7 * D).toISOString())
    .eq("email_opt_out", false)
    .limit(200);
  for (const p of waiting ?? []) {
    if (!p.email) continue;
    const plan = await getPlan(p.email);
    if (plan.paid) continue;
    const age = now - Date.parse(p.paywall_seen_at);
    const kind = age < D ? "waiting1" : "waiting24";
    const { data: r } = await db.from("reports").select("result").eq("user_id", p.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    const res = r?.result as { leaks: { merchant: string }[]; fees: unknown[] } | undefined;
    const n = res ? res.leaks.length + res.fees.length : 0;
    const ok = await sendOnce({
      userId: p.id,
      to: p.email,
      kind,
      subject: "Your leak report is waiting",
      title: "Your leak report is waiting.",
      body: [
        n
          ? `It's saved in your account: <b>${n} recurring ${n === 1 ? "charge" : "charges"}</b>${res!.leaks[0] ? `, starting with <b>${res!.leaks[0].merchant}</b>` : ""}.`
          : "Your report is saved in your account.",
        cheapest ? `Unlock every leak and your monthly total from ${cheapest.per_day} a day. Cancel anytime.` : "Unlock every leak and your monthly total. Cancel anytime.",
      ],
      cta: { label: "See my full leak report", href: `${SITE_URL}/dashboard` },
    });
    if (ok) sent[kind]++;
  }

  // 2. Win-back, 7 days after a cancellation.
  const { data: cancelled } = await db
    .from("profiles")
    .select("id, email, cancelled_at")
    .lt("cancelled_at", new Date(now - 7 * D).toISOString())
    .gt("cancelled_at", new Date(now - 14 * D).toISOString())
    .eq("email_opt_out", false)
    .limit(200);
  for (const p of cancelled ?? []) {
    if (!p.email) continue;
    if ((await getPlan(p.email)).paid) continue;
    const ok = await sendOnce({
      userId: p.id,
      to: p.email,
      kind: "winback",
      key: String(p.cancelled_at).slice(0, 10),
      subject: "New charges since you left?",
      title: "Subscriptions come back quietly.",
      body: [
        "Free trials turn into charges, prices go up, fees reappear. A new statement is the fastest way to know.",
        "Your past reports are still in your account. Scan this month's statement and see what changed.",
      ],
      cta: { label: "Find my leaks", href: `${SITE_URL}/dashboard` },
    });
    if (ok) sent.winback++;
  }

  // 3. Weekly recap, on Mondays (UTC).
  if (new Date(now).getUTCDay() === 1) {
    const since = new Date(now - 7 * D).toISOString();
    const week = new Date(now).toISOString().slice(0, 10);
    const [{ data: reps }, { data: acts }] = await Promise.all([
      db.from("reports").select("user_id, result").not("user_id", "is", null).gte("created_at", since).limit(1000),
      db.from("leak_actions").select("user_id, monthly, status").eq("status", "cancelled").gte("updated_at", since).limit(1000),
    ]);
    const by = new Map<string, { scans: number; found: number; saved: number }>();
    for (const r of reps ?? []) {
      const e = by.get(r.user_id) ?? { scans: 0, found: 0, saved: 0 };
      e.scans++;
      const res = r.result as { leaks: unknown[]; fees: unknown[] };
      e.found += (res?.leaks?.length ?? 0) + (res?.fees?.length ?? 0);
      by.set(r.user_id, e);
    }
    for (const a of acts ?? []) {
      const e = by.get(a.user_id) ?? { scans: 0, found: 0, saved: 0 };
      e.saved += Number(a.monthly);
      by.set(a.user_id, e);
    }
    const ids = [...by.keys()].slice(0, 300);
    if (ids.length) {
      const { data: people } = await db.from("profiles").select("id, email").in("id", ids).eq("email_opt_out", false);
      for (const p of people ?? []) {
        const e = by.get(p.id)!;
        if (!p.email) continue;
        const ok = await sendOnce({
          userId: p.id,
          to: p.email,
          kind: "recap",
          key: week,
          subject: "Your week in Budgeto",
          title: "Your week in Budgeto.",
          body: [
            `${e.scans} ${e.scans === 1 ? "statement" : "statements"} scanned · ${e.found} recurring ${e.found === 1 ? "charge" : "charges"} found.`,
            e.saved > 0 ? `You cancelled <b>${usd(e.saved)}/mo</b> this week. That's ${usd(e.saved * 12)} a year you keep.` : "Nothing cancelled yet this week: open your report and pick one to stop.",
          ],
          cta: { label: "Open Budgeto", href: `${SITE_URL}/dashboard` },
        });
        if (ok) sent.recap++;
      }
    }
  }

  return json({ ok: true, sent });
}
