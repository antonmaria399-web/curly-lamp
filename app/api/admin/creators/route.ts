import { z } from "zod";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isOwner } from "@/lib/growth";
import { fail, json, sameOrigin } from "@/lib/http";

const Body = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "accepted", "active", "stopped"]).optional(),
  code: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_-]{0,24}$/)
    .optional(),
});

/** Owner only: change a creator's status or tracking code. */
export async function PATCH(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!isOwner(user?.email)) return fail("Not found", 404);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("Bad request");
  const { id, ...rest } = parsed.data;
  const patch: Record<string, string | null> = {};
  if (rest.status) patch.status = rest.status;
  if (rest.code !== undefined) patch.code = rest.code || null;
  const { error } = await supabaseAdmin().from("creator_applications").update(patch).eq("id", id);
  if (error) return fail(error.message, 400);
  return json({ ok: true });
}
