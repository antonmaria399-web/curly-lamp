import "server-only";
import { createHmac } from "node:crypto";
import { supabaseAdmin } from "./supabase/admin";
import { track, type KwopEvent } from "./kwop";

/** Invite rewards, in Budgeto's own unit (extra statement scans: they cost nothing to give). */
export const REWARD = { friendSignup: 3, friendPaid: 10 } as const;

/** Creator pay: from env, never more than these. */
export const creatorRate = () => Math.max(0, Number(process.env.CREATOR_RATE) || 1); // $ per 1,000 views
export const creatorCap = () => Math.max(0, Number(process.env.CREATOR_CAP) || 100); // $ per video

export const OWNER_EMAIL = () => (process.env.OWNER_EMAIL || "").trim().toLowerCase();
export const isOwner = (email: string | null | undefined) => Boolean(email && OWNER_EMAIL() && email.toLowerCase() === OWNER_EMAIL());

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://budgetoo-nine.vercel.app").replace(/\/+$/, "");

/** Log a funnel event: locally (for /admin numbers and emails) and to Kwop. Never throws, never blocks long. */
type LocalEvent = "paid" | "cancelled" | "checkout";
export async function logEvent(type: KwopEvent | LocalEvent, user: { id: string; email?: string | null } | null, detail?: string) {
  if (user?.email && type !== "paid" && type !== "cancelled" && type !== "checkout") track(type, user.email, detail);
  try {
    await supabaseAdmin().from("events").insert({ type, user_id: user?.id || null, detail: detail?.slice(0, 120) ?? null });
  } catch {}
}

const ALPHA = "abcdefghjkmnpqrstuvwxyz23456789";
function newCode(n = 7) {
  let s = "";
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  for (const b of bytes) s += ALPHA[b % ALPHA.length];
  return s;
}

/** The user's invite code (created once). */
export async function inviteCode(userId: string): Promise<string> {
  const db = supabaseAdmin();
  const { data } = await db.from("profiles").select("invite_code").eq("id", userId).maybeSingle();
  if (data?.invite_code) return data.invite_code;
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    const { error } = await db.from("profiles").update({ invite_code: code }).eq("id", userId).is("invite_code", null);
    if (!error) {
      const { data: again } = await db.from("profiles").select("invite_code").eq("id", userId).maybeSingle();
      if (again?.invite_code) return again.invite_code;
    }
  }
  throw new Error("invite code");
}

export async function bonusScans(userId: string) {
  const { data } = await supabaseAdmin().from("profiles").select("bonus_scans").eq("id", userId).maybeSingle();
  return data?.bonus_scans ?? 0;
}

async function grant(userId: string, friendId: string, kind: "signup" | "friend_signup" | "friend_paid", scans: number) {
  const db = supabaseAdmin();
  const { error } = await db.from("invite_rewards").insert({ user_id: userId, friend_id: friendId, kind, scans });
  if (error) return false; // already granted (unique)
  const { data } = await db.from("profiles").select("bonus_scans").eq("id", userId).maybeSingle();
  await db.from("profiles").update({ bonus_scans: (data?.bonus_scans ?? 0) + scans }).eq("id", userId);
  return true;
}

/** A friend signed up with an invite link: both get extra scans. */
export async function rewardSignup(friend: { id: string; email?: string | null }, code: string) {
  if (!/^[a-z0-9]{4,12}$/.test(code)) return;
  const db = supabaseAdmin();
  const { data: inviter } = await db.from("profiles").select("id, email").eq("invite_code", code).maybeSingle();
  if (!inviter || inviter.id === friend.id) return;
  const { data: me } = await db.from("profiles").select("invited_by").eq("id", friend.id).maybeSingle();
  if (me?.invited_by) return;
  await db.from("profiles").update({ invited_by: inviter.id }).eq("id", friend.id);
  await grant(inviter.id, friend.id, "friend_signup", REWARD.friendSignup);
  await grant(friend.id, inviter.id, "signup", REWARD.friendSignup);
  await logEvent("invite_signup", { id: inviter.id, email: inviter.email }, code);
}

/** A friend paid: the inviter gets a bigger reward (once). */
export async function rewardPaid(friendId: string) {
  const db = supabaseAdmin();
  const { data: me } = await db.from("profiles").select("invited_by, invite_paid_rewarded").eq("id", friendId).maybeSingle();
  if (!me?.invited_by || me.invite_paid_rewarded) return;
  await db.from("profiles").update({ invite_paid_rewarded: true }).eq("id", friendId);
  await grant(me.invited_by, friendId, "friend_paid", REWARD.friendPaid);
}

/** Signed tokens (unsubscribe links). */
const secret = () => process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "budgeto";
export const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url").slice(0, 32);
export const verify = (v: string, t: string) => t.length === 32 && sign(v) === t;

/** Per-IP rate limit on a table with ip + created_at columns. */
export async function rateLimited(table: "creator_applications", ip: string, max: number, windowMs: number) {
  const since = new Date(Date.now() - windowMs).toISOString();
  const { count } = await supabaseAdmin().from(table).select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", since);
  return (count ?? 0) >= max;
}
