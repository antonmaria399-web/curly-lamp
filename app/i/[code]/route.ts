import { NextResponse } from "next/server";

/** Invite link: /i/<code> → remember the code (30 days) and open Budgeto. Both get extra scans at sign-up. */
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const to = new URL("/", req.url);
  if (!/^[a-z0-9]{4,12}$/.test(code)) return NextResponse.redirect(to);
  to.searchParams.set("invited", "1");
  const res = NextResponse.redirect(to);
  res.cookies.set("bdg_inv", code, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });
  return res;
}
