import "server-only";
import { supabaseAdmin } from "./supabase/admin";
import { unsubToken } from "./growth";
import { SITE_URL } from "./seo";
import { SUPPORT_EMAIL } from "./brand";

/**
 * Emails with Resend's free plan. Without RESEND_API_KEY every send is skipped silently.
 * RESEND_FROM must be an address on a domain verified in Resend (e.g. "Budgeto <hello@yourdomain.com>").
 * Each (user, kind, key) is sent once (email_log unique), with a one-click unsubscribe.
 */
export const emailOn = () => Boolean(process.env.RESEND_API_KEY);

type Mail = { userId: string; to: string; kind: string; key?: string; subject: string; title: string; body: string[]; cta?: { label: string; href: string } };

function html(m: Mail, unsub: string) {
  const p = m.body.map((t) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#3f3f46">${t}</p>`).join("");
  const btn = m.cta
    ? `<a href="${m.cta.href}" style="display:inline-block;background:#C8FF3D;color:#0A0B0A;font-weight:700;font-size:16px;text-decoration:none;padding:14px 26px;border-radius:999px;margin:8px 0 18px">${m.cta.label} &rarr;</a>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#FAFAFA;font-family:Inter,Helvetica,Arial,sans-serif">
<div style="max-width:520px;margin:0 auto;padding:32px 20px">
<div style="font-weight:800;font-size:20px;color:#0A0B0A;margin-bottom:24px"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:8px;background:#C8FF3D;margin-right:8px">B</span>Budgeto</div>
<div style="background:#fff;border:1px solid rgba(10,11,10,.08);border-radius:18px;padding:28px 24px">
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;letter-spacing:-0.02em;color:#0A0B0A">${m.title}</h1>${p}${btn}
</div>
<p style="font-size:12px;color:#71717a;margin-top:18px;line-height:1.5">You get this because you have a Budgeto account. <a href="${unsub}" style="color:#71717a">Unsubscribe in one click</a>. Questions: ${SUPPORT_EMAIL}</p>
</div></body></html>`;
}

/** Sends once per (user, kind, key). Returns true if sent. Never throws. */
export async function sendOnce(m: Mail): Promise<boolean> {
  if (!emailOn()) return false;
  const db = supabaseAdmin();
  const { data: p } = await db.from("profiles").select("email_opt_out").eq("id", m.userId).maybeSingle();
  if (p?.email_opt_out) return false;
  // Reserve the slot first: a duplicate insert fails, so the same email never goes twice.
  const { error } = await db.from("email_log").insert({ user_id: m.userId, kind: m.kind, key: m.key ?? "" });
  if (error) return false;
  const unsub = `${SITE_URL}/api/unsubscribe?u=${m.userId}&t=${unsubToken(m.userId)}`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Budgeto <onboarding@resend.dev>",
        to: [m.to],
        subject: m.subject,
        html: html(m, unsub),
        headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      }),
    });
    if (!r.ok) {
      console.error("[email]", m.kind, r.status, (await r.text()).slice(0, 200));
      await db.from("email_log").delete().eq("user_id", m.userId).eq("kind", m.kind).eq("key", m.key ?? "");
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email]", m.kind, (e as Error).message);
    await db.from("email_log").delete().eq("user_id", m.userId).eq("kind", m.kind).eq("key", m.key ?? "");
    return false;
  }
}
