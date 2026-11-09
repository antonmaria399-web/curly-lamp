import "server-only";
import { cache } from "react";
import { getUser } from "./supabase/server";
import { supabaseAdmin } from "./supabase/admin";
import { getPlan, getPlans, type PlanState } from "./kwop";
import { LIMITS, tierOf, type Limits, type Tier } from "./quotas";

export type Viewer = {
  user: { id: string; email: string; name: string | null } | null;
  plan: PlanState;
  tier: Tier;
  limits: Limits;
};

/** Who is looking, and what they paid for (checked with Kwop on the server, never trusted from the browser). */
export const getViewer = cache(async (opts: { fresh?: boolean } = {}): Promise<Viewer> => {
  const u = await getUser();
  if (!u) return { user: null, plan: { paid: false, plan: null, status: null, until: null }, tier: 0, limits: LIMITS[0] };
  const [plan, { plans }] = await Promise.all([getPlan(u.email, opts), getPlans()]);
  const tier = plan.paid ? tierOf(plans, plan.plan?.id) : 0;
  return {
    user: { id: u.id, email: u.email!, name: (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || null },
    plan,
    tier,
    limits: LIMITS[tier],
  };
});

/** Start of the current billing period (30 days before renewal, or 30 days ago). */
export function periodStart(until: string | null): Date {
  const now = Date.now();
  if (until) {
    let end = Date.parse(until);
    if (!Number.isNaN(end)) {
      while (end - 30 * 86400000 > now) end -= 30 * 86400000;
      return new Date(end - 30 * 86400000);
    }
  }
  return new Date(now - 30 * 86400000);
}

export async function scansUsed(userId: string, since: Date) {
  const { count } = await supabaseAdmin()
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since.toISOString());
  return count ?? 0;
}
