import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { clientIp, fail, json, sameOrigin } from "@/lib/http";
import { logEvent, rateLimited } from "@/lib/growth";

const Body = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(160),
  handle: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^@?[\w.\-]+$/, "Your handle, like @yourname"),
  platform: z.enum(["tiktok", "instagram", "both"]),
  avg_views: z.coerce.number().int().min(0).max(100_000_000),
  country: z.string().trim().min(2).max(60),
  website: z.string().max(0).optional(), // honeypot
});

/** Anyone can apply (5 a day per IP). Only the owner reads the applications (in /admin). */
export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    const f = parsed.error.issues[0];
    return fail(f?.path[0] === "email" ? "Enter a valid email." : f?.message && !f.message.startsWith("Too") && !f.message.startsWith("Invalid") ? f.message : `Check the ${String(f?.path[0] ?? "form").replace("_", " ")} field.`);
  }
  const ip = await clientIp();
  if (await rateLimited("creator_applications", ip, 5, 86400000)) return fail("You already applied today. We'll get back to you by email.", 429);
  const b = parsed.data;
  const { error } = await supabaseAdmin()
    .from("creator_applications")
    .insert({ name: b.name, email: b.email, handle: b.handle.startsWith("@") ? b.handle : "@" + b.handle, platform: b.platform, avg_views: b.avg_views, country: b.country, ip });
  if (error) {
    console.error("[creators]", error.message);
    return fail("We couldn't save your application. Try again.", 500);
  }
  await logEvent("creator_apply", { id: "", email: b.email }, b.platform).catch(() => {});
  return json({ ok: true });
}
