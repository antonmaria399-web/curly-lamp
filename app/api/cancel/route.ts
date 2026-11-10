import { z } from "zod";
import { cancelPlan } from "@/lib/kwop";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fail, json, sameOrigin } from "@/lib/http";
import { logEvent } from "@/lib/growth";

const Body = z.object({
  reason: z.enum(["too_expensive", "not_using", "missing", "other"]).optional(),
  note: z.string().max(500).optional(),
  /** false = only save the reason (the "before you go" step); true = cancel now. */
  confirm: z.boolean().optional(),
});

export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user?.email) return fail("Sign in first", 401);
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  const b = parsed.success ? parsed.data : {};
  const db = supabaseAdmin();
  if (b.reason && !b.confirm) {
    await db.from("cancel_feedback").insert({ user_id: user.id, reason: b.reason, note: b.note?.trim() || null });
    await logEvent("cancel_reason", { id: user.id, email: user.email }, b.reason);
    return json({ ok: true });
  }
  if (b.note?.trim()) await db.from("cancel_feedback").insert({ user_id: user.id, reason: b.reason ?? "missing", note: b.note.trim() });
  try {
    const r = await cancelPlan(user.email);
    await logEvent("cancelled", { id: user.id }, b.reason);
    const { data: last } = await db.from("cancel_feedback").select("id").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (last) await db.from("cancel_feedback").update({ cancelled: true }).eq("id", last.id);
    return json(r);
  } catch {
    return fail("We couldn't reach billing. Try again in a minute.", 502);
  }
}
