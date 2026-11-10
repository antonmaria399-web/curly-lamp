import "server-only";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export const fail = (message: string, status = 400, extra: Record<string, unknown> = {}) => json({ error: message, ...extra }, status);

export async function clientIp() {
  const h = await headers();
  // x-real-ip is set by Vercel's edge and can't be forged by the client; x-forwarded-for is the fallback.
  return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0").trim();
}

/** Same-origin check for state-changing requests. */
export async function sameOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  // No Origin header: allow server-to-server/old clients, but never a request the browser marks cross-site.
  if (!origin) return h.get("sec-fetch-site") !== "cross-site";
  const host = h.get("x-forwarded-host") || h.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
