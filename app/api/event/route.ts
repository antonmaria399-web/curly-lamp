import { getUser } from "@/lib/supabase/server";
import { json, sameOrigin } from "@/lib/http";
import { logEvent } from "@/lib/growth";

const ALLOWED = new Set(["paywall_view", "onboarding_done", "feature_used", "share", "invite_sent", "offer_view"] as const);
type Allowed = typeof ALLOWED extends Set<infer T> ? T : never;

/** Browser → server relay for funnel events (kept for /admin, sent to Kwop fire-and-forget). */
export async function POST(req: Request) {
  if (!(await sameOrigin())) return json({ ok: false }, 403);
  const body = await req.json().catch(() => ({}));
  const type = String(body.type || "") as Allowed;
  if (!ALLOWED.has(type)) return json({ ok: false }, 400);
  const user = await getUser();
  const detail = typeof body.detail === "string" ? body.detail.slice(0, 60) : undefined;
  if (user || type === "share") await logEvent(type, user ? { id: user.id, email: user.email } : null, detail);
  return json({ ok: true });
}
