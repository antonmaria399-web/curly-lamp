import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { fail, json, sameOrigin } from "@/lib/http";
import { logEvent } from "@/lib/growth";

const WINDOW = 30 * 60 * 1000;

/**
 * The one honest offer on the first ✕ of the paywall: the yearly plan at its real −20% price,
 * with a real 30-minute window saved on the server. Shown once per account, never again.
 */
export async function POST() {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user) return json({ show: false });
  const db = supabaseAdmin();
  const { data: p } = await db.from("profiles").select("offer_seen_at, offer_until").eq("id", user.id).maybeSingle();
  if (!p || p.offer_seen_at) return json({ show: false });
  const now = new Date();
  const until = new Date(now.getTime() + WINDOW).toISOString();
  const { data: upd } = await db.from("profiles").update({ offer_seen_at: now.toISOString(), offer_until: until }).eq("id", user.id).is("offer_seen_at", null).select("id");
  if (!upd?.length) return json({ show: false });
  await logEvent("offer_view", { id: user.id, email: user.email });
  return json({ show: true, until });
}

/** Is the window still open (to keep showing its real end time)? */
export async function GET() {
  const user = await getUser();
  if (!user) return json({ until: null });
  const { data: p } = await supabaseAdmin().from("profiles").select("offer_until").eq("id", user.id).maybeSingle();
  const open = p?.offer_until && Date.parse(p.offer_until) > Date.now();
  return json({ until: open ? p!.offer_until : null });
}
