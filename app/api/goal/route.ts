import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";
import { fail, json, sameOrigin } from "@/lib/http";
import { track } from "@/lib/kwop";

const Body = z.object({ goal: z.number().min(0).max(100000).nullable() });

export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const viewer = await getViewer();
  if (!viewer.user) return fail("Sign in first", 401);
  if (!viewer.limits.goals) return fail("Unlock Budgeto to set a savings goal.", 402);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("Enter an amount, like 150.");
  const sb = await supabaseServer();
  const { error } = await sb
    .from("profiles")
    .update({ goal_monthly: parsed.data.goal, goal_started_at: parsed.data.goal ? new Date().toISOString() : null })
    .eq("id", viewer.user.id);
  if (error) return fail("Couldn't save. Try again.", 500);
  track("feature_used", viewer.user.email, "savings_goal_tracker");
  return json({ ok: true });
}
