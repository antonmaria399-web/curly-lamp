import { track, type KwopEvent } from "@/lib/kwop";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logEvent } from "@/lib/growth";
import { json, sameOrigin } from "@/lib/http";

const ALLOWED = new Set<KwopEvent>(["paywall_view", "onboarding_done", "feature_used", "share", "invite_sent"]);

/** Browser → server relay for funnel events (the server sends them to Kwop, fire-and-forget). */
export async function POST(req: Request) {
  if (!(await sameOrigin())) return json({ ok: false }, 403);
  const body = await req.json().catch(() => ({}));
  const type = String(body.type || "") as KwopEvent;
  if (!ALLOWED.has(type)) return json({ ok: false }, 400);
  const detail = typeof body.detail === "string" ? body.detail.slice(0, 60) : undefined;
  const user = await getUser();
  if (user?.email) {
    track(type, user.email, detail);
    if (type === "paywall_view" || type === "share" || type === "invite_sent") logEvent(type, user.id, detail);
    if (type === "paywall_view") {
      // For the "your leak report is waiting" emails (1 h and 24 h after a paywall view without payment).
      await supabaseAdmin().from("profiles").update({ paywall_seen_at: new Date().toISOString() }).eq("id", user.id).is("paywall_seen_at", null);
    }
  }
  return json({ ok: true });
}
