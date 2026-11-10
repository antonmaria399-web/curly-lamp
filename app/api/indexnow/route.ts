import { timingSafeEqual } from "node:crypto";
import { fail, json } from "@/lib/http";
import { INDEXNOW_KEY } from "@/lib/indexnow";
import { SITE_URL } from "@/lib/identity";
import sitemap from "@/app/sitemap";

/**
 * Sends every public URL (the sitemap) to IndexNow (Bing, Yandex, Seznam, Naver…), from Vercel's network.
 * Used by scripts/indexnow.mjs when the machine running it cannot reach api.indexnow.org itself.
 * Auth: Authorization: Bearer $INDEXNOW_SECRET. The URL list is never taken from the request.
 */
export async function POST(req: Request) {
  const secret = process.env.INDEXNOW_SECRET || "";
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!secret || got.length !== secret.length || !timingSafeEqual(Buffer.from(got), Buffer.from(secret))) return fail("Not allowed.", 401);
  const urlList = sitemap().map((u) => u.url);
  const host = new URL(SITE_URL).host;
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`, urlList }),
    cache: "no-store",
  }).catch((e: Error) => ({ status: 0, statusText: e.message }) as Response);
  return json({ status: r.status, urls: urlList }, r.status >= 200 && r.status < 300 ? 200 : 502);
}
