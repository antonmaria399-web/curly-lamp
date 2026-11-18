import { z } from "zod";
import { track } from "@/lib/kwop";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fail, json, sameOrigin } from "@/lib/http";

const Body = z.object({
  reason: z.enum(["too_expensive", "not_using", "missing", "other"]),
  detail: z.string().trim().max(600).optional(),
  id: z.number().int().positive().optional(),
});

/** "Before you go": the one-tap reason someone cancels, and "tell us what's missing" (read in /admin). */
export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user?.email) return fail("Sign in first", 401);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("Pick a reason");
  const db = supabaseAdmin();
  const { reason, detail, id } = parsed.data;
  if (id) {
    await db.from("cancel_feedback").update({ detail: detail || null }).eq("id", id).eq("user_id", user.id);
    return json({ ok: true, id });
  }
  const { data } = await db.from("cancel_feedback").insert({ user_id: user.id, reason, detail: detail || null }).select("id").single();
  track("cancel_reason", user.email, reason);
  return json({ ok: true, id: data?.id ?? null });
}
