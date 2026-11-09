import { cancelPlan, confirmCheckout, getPlan, getPlans, track } from "@/lib/kwop";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fail, json, sameOrigin } from "@/lib/http";

export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user?.email) return fail("Sign in first", 401);
  const body = await req.json().catch(() => ({}));
  const ref = String(body.ref || "");
  if (!/^[\w-]{4,80}$/.test(ref)) return fail("Bad reference");
  const before = await getPlan(user.email);
  const c = await confirmCheckout(ref).catch(() => ({ ok: false, paid: false }));
  const state = await getPlan(user.email, { fresh: true });
  if (state.paid) {
    // Upgrade / change: stop the old plan at the end of its period, never two plans billed.
    if (before.paid && before.plan && state.plan && before.plan.id !== state.plan.id) {
      cancelPlan(user.email, ref).catch(() => {});
    }
    track("aha", user.email);
    await supabaseAdmin().from("profiles").update({ last_plan: state }).eq("id", user.id);
  }
  const { plans } = await getPlans();
  const plan = plans.find((p) => p.id === state.plan?.id) ?? null;
  return json({ ok: c.ok, paid: state.paid, plan: state.plan, plan_full: plan });
}
