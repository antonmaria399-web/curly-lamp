import { cookies } from "next/headers";
import { after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { fail, json, sameOrigin } from "@/lib/http";
import { track } from "@/lib/kwop";
import { REWARD, inviteCode, logEvent } from "@/lib/growth";
import { sendOnce } from "@/lib/email";
import { SITE_URL } from "@/lib/seo";
import { usd } from "@/lib/cn";
import type { ReportResult } from "@/lib/types";

/** Called right after sign-up / log-in: attaches this device's tries to the account and saves k / plan / utm / ref / invite. */
export async function POST() {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user) return fail("Not signed in", 401);
  const store = await cookies();
  const db = supabaseAdmin();
  const device = store.get("bdg_dev")?.value;
  let claimed = 0;
  if (device) {
    const { data } = await db.from("reports").update({ user_id: user.id }).is("user_id", null).eq("device_id", device).select("id");
    claimed = data?.length ?? 0;
  }
  const { data: profile } = await db.from("profiles").select("kwop_k, intended_plan, source, created_at, invited_by").eq("id", user.id).maybeSingle();
  const patch: Record<string, unknown> = {};
  const k = store.get("kwop_k")?.value;
  if (k && /^[A-Za-z0-9]{1,12}$/.test(k) && !profile?.kwop_k) patch.kwop_k = k;
  const plan = store.get("bdg_plan")?.value;
  if (plan && !profile?.intended_plan) patch.intended_plan = plan.slice(0, 40);
  // utm_* and the creator's ?ref= code, kept together in profiles.source (credited in /admin).
  if (!profile?.source) {
    const source: Record<string, string> = {};
    try {
      Object.assign(source, JSON.parse(store.get("bdg_src")?.value || "{}"));
    } catch {}
    const ref = store.get("bdg_ref")?.value;
    if (ref && /^[A-Za-z0-9_-]{1,24}$/.test(ref)) source.ref = ref;
    if (Object.keys(source).length) patch.source = source;
  }
  if (!profile) {
    await db.from("profiles").upsert({ id: user.id, email: user.email, ...patch });
  } else if (Object.keys(patch).length) {
    await db.from("profiles").update(patch).eq("id", user.id);
  }
  const isNew = !profile || Date.now() - Date.parse(profile.created_at) < 5 * 60 * 1000;

  // Invite: a brand-new account that came from /i/<code> gives both of them extra scans.
  let invited = false;
  const inv = store.get("bdg_inv")?.value;
  if (isNew && inv && /^[a-z0-9]{4,12}$/.test(inv) && !profile?.invited_by) {
    const { data: inviter } = await db.from("profiles").select("id, email").eq("invite_code", inv).maybeSingle();
    if (inviter && inviter.id !== user.id) {
      await db.from("profiles").update({ invited_by: inviter.id }).eq("id", user.id);
      await db.from("rewards").upsert(
        [
          { user_id: inviter.id, kind: "invite_signup", scans: REWARD.signup, friend_id: user.id },
          { user_id: user.id, kind: "invited_welcome", scans: REWARD.welcome, friend_id: inviter.id },
        ],
        { onConflict: "user_id,kind,friend_id", ignoreDuplicates: true },
      );
      track("invite_signup", inviter.email, inv);
      logEvent("invite_signup", user.id, inv);
      invited = true;
    }
  }
  if (inv) store.delete("bdg_inv");

  if (isNew) {
    track("signup", user.email);
    logEvent("signup", user.id);
  }
  if (claimed > 0) track("onboarding_done", user.email);
  await inviteCode(user.id).catch(() => null);
  const { data: latest } = await db.from("reports").select("id, result").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();

  // Welcome email with their result (once). The total stays for the app: the email says what was found.
  if (isNew && user.email) {
    const r = latest?.result as ReportResult | undefined;
    const n = r ? r.leaks.length + r.fees.length : 0;
    after(() =>
      sendOnce({
        userId: user.id,
        to: user.email!,
        kind: "welcome",
        subject: r ? "Your leak report is ready" : "Welcome to Budgeto",
        title: r ? "Your leak report is ready." : "Welcome to Budgeto.",
        body: r
          ? [
              `We found <b>${n} recurring ${n === 1 ? "charge" : "charges"}</b> on your statement${r.leaks[0] ? `, starting with <b>${r.leaks[0].merchant}</b> (${usd(r.leaks[0].monthly)}/mo)` : ""}.`,
              "Your report is saved in your account. Open it to see every leak, the monthly total and how to stop each one.",
            ]
          : ["Drop last month's statement PDF (or a photo of it) and Budgeto lists every subscription and bank fee in seconds. No bank login."],
        cta: { label: r ? "Open my leak report" : "Find my leaks", href: `${SITE_URL}/dashboard` },
      }),
    );
  }
  return json({ ok: true, claimed, invited, latest: latest?.id ?? null });
}
