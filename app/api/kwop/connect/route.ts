import { timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { connectApp } from "@/lib/kwop";
import { fail, json } from "@/lib/http";

export const runtime = "nodejs";

/**
 * One-time (idempotent) Kwop connect, run by the owner's deploy step once the site is live:
 * POST /api/kwop/connect with "Authorization: Bearer <KWOP_CONNECT_SECRET>".
 * It lives on the server so KWOP_API (a sensitive Vercel variable) never leaves Vercel.
 */
export async function POST() {
  const secret = process.env.KWOP_CONNECT_SECRET;
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!secret || secret.length < 32 || !site?.startsWith("https://")) return fail("Not found", 404);
  const got = Buffer.from(((await headers()).get("authorization") || "").replace(/^Bearer\s+/i, ""));
  const want = Buffer.from(secret);
  if (got.length !== want.length || !timingSafeEqual(got, want)) return fail("Not found", 404);
  if (new URL((await headers()).get("x-url") || "http://x/").searchParams.has("check") || (await headers()).get("x-check") === "1") {
    // Shape only, never the key: helps the owner fix a bad paste.
    const raw = process.env.KWOP_API || "";
    return json({
      set: raw.length > 0,
      length: raw.length,
      starts_ok: raw.trim().startsWith("https://kwop.io/api/v2/app/kwk_"),
      has_space: /\s/.test(raw),
      slashes_after_app: (raw.split("/app/")[1] || "").split("/").length - 1,
      key_part_length: (raw.split("/app/")[1] || "").trim().length,
    });
  }
  try {
    return json({ url: site, kwop: await connectApp(site) });
  } catch (e) {
    console.error("[kwop connect]", e);
    return fail("Kwop connect failed", 502);
  }
}
