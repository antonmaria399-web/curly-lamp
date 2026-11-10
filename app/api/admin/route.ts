import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { fail, json, sameOrigin } from "@/lib/http";
import { isOwner } from "@/lib/growth";

const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status"), id: z.uuid(), status: z.enum(["new", "accepted", "active", "stopped"]) }),
  z.object({ action: z.literal("ref"), id: z.uuid(), ref_code: z.string().trim().regex(/^[A-Za-z0-9_-]{0,32}$/) }),
  z.object({
    action: z.literal("payout_add"),
    id: z.uuid(),
    week: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    video_url: z.string().trim().max(300).optional(),
    views: z.coerce.number().int().min(0).max(1_000_000_000),
  }),
  z.object({ action: z.literal("payout_delete"), payout_id: z.uuid() }),
]);

/** Owner-only actions for /admin. Anyone else: 404. */
export async function POST(req: Request) {
  const user = await getUser();
  if (!isOwner(user?.email)) return new Response("Not found", { status: 404 });
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return fail("Check the fields.");
  const b = parsed.data;
  const db = supabaseAdmin();
  if (b.action === "status") await db.from("creator_applications").update({ status: b.status }).eq("id", b.id);
  if (b.action === "ref") await db.from("creator_applications").update({ ref_code: b.ref_code || null }).eq("id", b.id);
  if (b.action === "payout_add") await db.from("creator_payouts").insert({ application_id: b.id, week: b.week, video_url: b.video_url || null, views: b.views });
  if (b.action === "payout_delete") await db.from("creator_payouts").delete().eq("id", b.payout_id);
  return json({ ok: true });
}
