import { cancelPlan, confirmCheckout, getPlan, getPlans, track } from "@/lib/kwop";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { REWARD, logEvent } from "@/lib/growth";
import { fail, json, sameOrigin } from "@/lib/http";

export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user?.email) return fail("Sign in first", 401);
  const body = await req.json().catch(() => ({}));
  const ref = String(body.ref || "");
  if (!/^[\w-]{4,80}$/.test(ref)) return fail("Bad reference");
  const db = supabaseAdmin();
  const before = await getPlan(user.email);
  const c = await confirmCheckout(ref).catch(() => ({ ok: false, paid: false }));
  const state = await getPlan(user.email, { fresh: true });
  const { plans } = await getPlans();
  const plan = plans.find((p) => p.id === state.plan?.id) ?? null;
  if (state.paid) {
    // Upgrade / change: stop the old plan at the end of its period, never two plans billed.
    if (before.paid && before.plan && state.plan && before.plan.id !== state.plan.id) {
      cancelPlan(user.email, ref).catch(() => {});
    }
    const { data: profile } = await db.from("profiles").select("invited_by, offer_ref").eq("id", user.id).maybeSingle();
    // Count each payment once (by ref) for /admin.
    const { count } = await db.from("events").select("id", { count: "exact", head: true }).eq("type", "payment").eq("detail", ref);
    if (!count) {
      // The amount of the checkout that was opened for this ref (month or year).
      const { data: started } = await db.from("events").select("amount_cents").eq("type", "checkout").like("detail", `${ref}:%`).limit(1).maybeSingle();
      const cents = started?.amount_cents ?? plan?.price_cents ?? null;
      logEvent("payment", user.id, ref, cents);
      track("aha", user.email);
      if (profile?.offer_ref === ref) {
        track("offer_paid", user.email, plan?.name);
        logEvent("offer_paid", user.id, ref);
      }
      // A friend who pays gives the inviter a bigger reward.
      if (profile?.invited_by) {
        await db
          .from("rewards")
          .upsert([{ user_id: profile.invited_by, kind: "invite_paid", scans: REWARD.paid, friend_id: user.id }], { onConflict: "user_id,kind,friend_id", ignoreDuplicates: true });
      }
    }
    await db.from("profiles").update({ last_plan: state, cancelled_at: null }).eq("id", user.id);
  }
  return json({ ok: c.ok, paid: state.paid, plan: state.plan, plan_full: plan });
}
