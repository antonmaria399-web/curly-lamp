import { track } from "@/lib/kwop";
import { getViewer } from "@/lib/viewer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logEvent } from "@/lib/growth";
import { fail, json, sameOrigin } from "@/lib/http";

const WINDOW_MS = 30 * 60 * 1000;

/**
 * The first ✕ on the paywall: one honest offer (the yearly plan at its real −20 % price), with a real
 * 30-minute window saved on the server. Shown once per account, never again.
 */
export async function POST() {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const viewer = await getViewer();
  if (!viewer.user) return json({ show: false });
  if (viewer.plan.paid) return json({ show: false });
  const db = supabaseAdmin();
  const until = new Date(Date.now() + WINDOW_MS).toISOString();
  // Only the first call wins (offer_until is null): the offer can never show twice.
  const { data } = await db.from("profiles").update({ offer_until: until }).eq("id", viewer.user.id).is("offer_until", null).select("offer_until");
  if (!data?.length) return json({ show: false });
  track("offer_view", viewer.user.email);
  logEvent("offer_view", viewer.user.id);
  return json({ show: true, until });
}
