import { supabaseAdmin } from "@/lib/supabase/admin";
import { verify } from "@/lib/growth";

async function unsubscribe(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("u") || "";
  const t = u.searchParams.get("t") || "";
  if (!/^[0-9a-f-]{36}$/i.test(id) || !verify("unsub:" + id, t)) return false;
  await supabaseAdmin().from("profiles").update({ email_opt_out: true }).eq("id", id);
  return true;
}

/** One-click unsubscribe (link in every email, and the List-Unsubscribe-Post header). */
export async function POST(req: Request) {
  const ok = await unsubscribe(req);
  return new Response(ok ? "Unsubscribed" : "Invalid link", { status: ok ? 200 : 400 });
}

export async function GET(req: Request) {
  const ok = await unsubscribe(req);
  const html = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Budgeto</title>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#060606;color:#fff;font-family:Inter,Helvetica,Arial,sans-serif;text-align:center;padding:24px">
<div><h1 style="font-size:28px;letter-spacing:-0.03em;margin:0">${ok ? "You're unsubscribed." : "This link doesn't work."}</h1>
<p style="color:rgba(255,255,255,.6)">${ok ? "Budgeto won't email you anymore. Your account and reports stay as they are." : "Open the latest email from Budgeto and try its link again."}</p>
<a href="/" style="display:inline-block;margin-top:16px;background:#C8FF3D;color:#0A0B0A;font-weight:600;text-decoration:none;border-radius:999px;padding:12px 22px">Back to Budgeto</a></div></body>`;
  return new Response(html, { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8" } });
}
