import { getPlans } from "@/lib/kwop";
import { json } from "@/lib/http";
import { TAGS, UNLOCKS, LIMITS } from "@/lib/quotas";
import { getViewer } from "@/lib/viewer";

/** Plans from Kwop (never hardcoded) + Budgeto's tags, quotas and unlock lines for each tier. */
export async function GET() {
  const [{ plans, checkout }, viewer] = await Promise.all([getPlans(), getViewer()]);
  const tiered = plans.map((p, i) => {
    const tier = (Math.min(3, Math.max(1, i + 1 - Math.max(0, plans.length - 3)))) as 1 | 2 | 3;
    return { ...p, tier, tag: TAGS[tier], unlocks: UNLOCKS[tier], scans: LIMITS[tier].scans, featured: tier === 2 };
  });
  return json({ plans: tiered, checkout, current: viewer.plan.paid ? viewer.plan.plan : null, tier: viewer.tier });
}
