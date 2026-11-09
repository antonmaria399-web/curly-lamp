import { track } from "@/lib/kwop";
import { getUser } from "@/lib/supabase/server";
import { json, sameOrigin } from "@/lib/http";

const ALLOWED = new Set(["paywall_view", "onboarding_done", "feature_used"]);

/** Browser → server relay for funnel events (the server sends them to Kwop, fire-and-forget). */
export async function POST(req: Request) {
  if (!(await sameOrigin())) return json({ ok: false }, 403);
  const body = await req.json().catch(() => ({}));
  const type = String(body.type || "");
  if (!ALLOWED.has(type)) return json({ ok: false }, 400);
  const user = await getUser();
  if (user?.email) track(type as "paywall_view", user.email, typeof body.detail === "string" ? body.detail.slice(0, 60) : undefined);
  return json({ ok: true });
}
