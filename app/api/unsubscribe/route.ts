import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkUnsub } from "@/lib/growth";

async function handle(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("u") || "";
  const t = u.searchParams.get("t") || "";
  const ok = /^[0-9a-f-]{36}$/i.test(id) && checkUnsub(id, t);
  if (ok) await supabaseAdmin().from("profiles").update({ email_opt_out: true }).eq("id", id);
  return ok;
}

/** One-click unsubscribe (RFC 8058 POST from mail apps). */
export async function POST(req: Request) {
  const ok = await handle(req);
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}

export async function GET(req: Request) {
  const ok = await handle(req);
  const html = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Budgeto</title><body style="font-family:Inter,system-ui,sans-serif;background:#FAFAFA;color:#0A0B0A;display:grid;place-items:center;min-height:100vh;margin:0;padding:20px;text-align:center"><div><div style="font-size:22px;font-weight:700">${ok ? "You're unsubscribed." : "This link didn't work."}</div><p style="color:#71717a">${ok ? "Budgeto won't email you again. Your account and reports stay as they are." : "Open Budgeto → Account to change your emails."}</p><a href="/" style="color:#0A0B0A;font-weight:600">Back to Budgeto</a></div>`;
  return new NextResponse(html, { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" } });
}
