import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/** OAuth (Google) and password-reset links land here. Then /claim attaches the try and sends them back where they were. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  let next = url.searchParams.get("next") || "/dashboard";
  if (!next.startsWith("/") || next.startsWith("//")) next = "/dashboard";
  if (code) {
    const sb = await supabaseServer();
    await sb.auth.exchangeCodeForSession(code);
  }
  const dest = new URL("/auth/done", url.origin);
  dest.searchParams.set("next", next);
  return NextResponse.redirect(dest);
}
