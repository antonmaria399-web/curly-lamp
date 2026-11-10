import { cookies } from "next/headers";
import { createCheckout, getPlans } from "@/lib/kwop";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { fail, json, sameOrigin } from "@/lib/http";

export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user?.email) return fail("Sign in first", 401);
  const body = await req.json().catch(() => ({}));
  const plan = Number(body.plan);
  const period = body.period === "year" ? "year" : "month";
  const { plans } = await getPlans();
  const p = plans.find((x) => x.id === plan);
  if (!p) return fail("Unknown plan");
  if (period === "year" && !p.yearly) return fail("No yearly price for this plan");
  const { data: profile } = await supabaseAdmin().from("profiles").select("kwop_k").eq("id", user.id).maybeSingle();
  const k = profile?.kwop_k || (await cookies()).get("kwop_k")?.value || null;
  try {
    const r = await createCheckout({ plan, period, email: user.email, k: k && /^[A-Za-z0-9]{1,12}$/.test(k) ? k : null });
    if (r.status === 409) return json({ error: "payments_off" }, 409);
    if (r.status >= 400 || !r.body.ref) return fail("Checkout is unavailable right now. Try again in a minute.", 502);
    // email: prefilled + locked in Whop's checkout, so the payment always matches this account (plans are looked up by email).
    return json({ embed: r.body.embed ?? null, ref: r.body.ref, fallback_url: r.body.fallback_url ?? null, email: user.email });
  } catch (e) {
    console.error("[checkout]", (e as Error).message);
    return fail("Checkout is unavailable right now. Try again in a minute.", 502);
  }
}
