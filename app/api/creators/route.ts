import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { track } from "@/lib/kwop";
import { clientIp, fail, json, sameOrigin } from "@/lib/http";

const Body = z.object({
  name: z.string().trim().min(1, "Your name").max(80),
  email: z.string().trim().toLowerCase().email("A valid email").max(120),
  handle: z
    .string()
    .trim()
    .min(2, "Your handle")
    .max(80)
    .transform((h) => (h.startsWith("@") || h.startsWith("http") ? h : "@" + h)),
  platform: z.enum(["tiktok", "instagram", "both"]),
  avg_views: z.coerce.number().int().min(0).max(100_000_000),
  country: z.string().trim().min(2, "Your country").max(60),
  website: z.string().max(0).optional(), // honeypot
});

/** Creator program application: anyone can apply (3 a day per IP); only the owner reads them (/admin). */
export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Check the form", 400, { field: parsed.error.issues[0]?.path[0] });
  const ip = await clientIp();
  const db = supabaseAdmin();
  const since = new Date(Date.now() - 86400000).toISOString();
  const { count } = await db.from("creator_applications").select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", since);
  if ((count ?? 0) >= 3) return fail("We already got your application today. We'll email you soon.", 429);
  const { website: _hp, ...row } = parsed.data;
  void _hp;
  const { error } = await db.from("creator_applications").insert({ ...row, ip });
  if (error) {
    console.error("[creators]", error.message);
    return fail("Couldn't send it. Try again in a minute.", 500);
  }
  track("creator_apply", row.email, row.platform);
  return json({ ok: true });
}
