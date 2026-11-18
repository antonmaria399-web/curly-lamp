import { NextResponse } from "next/server";

/** Invite link: /i/<code> → remember the code (30 days), land on the live product with a friendly banner. */
export async function GET(req: Request, ctx: RouteContext<"/i/[code]">) {
  const { code } = await ctx.params;
  const url = new URL(req.url);
  const to = new URL("/", url);
  const ok = /^[a-z0-9]{4,12}$/.test(code);
  if (ok) to.searchParams.set("invite", "1");
  url.searchParams.forEach((v, k) => {
    if (k.startsWith("utm_") || k === "ref" || k === "k") to.searchParams.set(k, v);
  });
  const res = NextResponse.redirect(to, 307);
  if (ok) res.cookies.set("bdg_inv", code, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
