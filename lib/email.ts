import "server-only";
import { supabaseAdmin } from "./supabase/admin";
import { sign, siteUrl } from "./growth";

/** Resend (free plan). Without RESEND_API_KEY, emails are skipped silently. */
export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY);

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function unsubscribeUrl(userId: string) {
  return `${siteUrl()}/api/unsubscribe?u=${userId}&t=${sign("unsub:" + userId)}`;
}

/** One simple, branded email: a title, a few lines, one button. */
export function layout({ title, lines, button, href, userId }: { title: string; lines: string[]; button: string; href: string; userId: string }) {
  const unsub = unsubscribeUrl(userId);
  const html = `<!doctype html><html><body style="margin:0;background:#FAFAFA;font-family:Inter,Helvetica,Arial,sans-serif;color:#0A0B0A">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border:1px solid rgba(10,11,10,.08);border-radius:20px;padding:32px">
<tr><td><div style="display:inline-block;background:#C8FF3D;color:#0A0B0A;font-weight:800;border-radius:10px;width:32px;height:32px;line-height:32px;text-align:center">B</div>
<span style="font-weight:700;font-size:18px;margin-left:8px;vertical-align:middle">Budgeto</span></td></tr>
<tr><td style="padding-top:24px"><h1 style="font-size:26px;line-height:1.15;letter-spacing:-0.03em;margin:0">${esc(title)}</h1></td></tr>
${lines.map((l) => `<tr><td style="padding-top:12px;font-size:16px;line-height:1.55;color:#3f3f46">${esc(l)}</td></tr>`).join("")}
<tr><td style="padding-top:28px"><a href="${href}" style="display:inline-block;background:#C8FF3D;color:#0A0B0A;font-weight:600;text-decoration:none;border-radius:999px;padding:14px 26px;font-size:16px">${esc(button)} &rarr;</a></td></tr>
</table>
<p style="font-size:12px;color:#71717A;margin-top:18px">You get this because you have a Budgeto account. <a href="${unsub}" style="color:#71717A">Unsubscribe in one click</a>.</p>
</td></tr></table></body></html>`;
  const text = `${title}\n\n${lines.join("\n\n")}\n\n${button}: ${href}\n\nUnsubscribe: ${unsub}`;
  return { html, text, unsub };
}

/** Sends once per (user, kind, key). Returns true if sent. */
export async function sendOnce(user: { id: string; email: string }, kind: string, key: string, mail: { subject: string; title: string; lines: string[]; button: string; href: string }) {
  if (!emailEnabled()) return false;
  const db = supabaseAdmin();
  const { error } = await db.from("email_log").insert({ user_id: user.id, kind, key });
  if (error) return false; // already sent
  const { html, text, unsub } = layout({ ...mail, userId: user.id });
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Budgeto <onboarding@resend.dev>",
        to: [user.email],
        subject: mail.subject,
        html,
        text,
        headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      }),
    });
    if (!r.ok) throw new Error("resend " + r.status + " " + (await r.text()).slice(0, 200));
    return true;
  } catch (e) {
    console.error("[email]", kind, (e as Error).message);
    await db.from("email_log").delete().eq("user_id", user.id).eq("kind", kind).eq("key", key); // retry next run
    return false;
  }
}
