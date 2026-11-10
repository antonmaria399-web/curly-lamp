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
  try {
    return json({ url: site, kwop: await connectApp(site) });
  } catch (e) {
    console.error("[kwop connect]", e);
    return fail("Kwop connect failed", 502);
  }
}
