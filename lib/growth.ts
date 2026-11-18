import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { after } from "next/server";
import { supabaseAdmin } from "./supabase/admin";

/** Rewards in Budgeto's own unit: extra statement scans (they cost us almost nothing, they're worth a lot to a saver). */
export const REWARD = { signup: 3, welcome: 3, paid: 10 } as const;

export const OWNER_EMAIL = () => (process.env.OWNER_EMAIL || "").trim().toLowerCase();
export const isOwner = (email: string | null | undefined) => Boolean(email && OWNER_EMAIL() && email.toLowerCase() === OWNER_EMAIL());

export const CREATOR_RATE = () => Math.max(0, Number(process.env.CREATOR_RATE) || 1); // $ per 1,000 views
export const CREATOR_CAP = () => Math.max(0, Number(process.env.CREATOR_CAP) || 100); // $ max per video

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
function newCode() {
  const b = randomBytes(7);
  return Array.from(b, (x) => ALPHABET[x % ALPHABET.length]).join("");
}

/** The user's invite code (created on first use). */
export async function inviteCode(userId: string): Promise<string> {
  const db = supabaseAdmin();
  const { data } = await db.from("profiles").select("invite_code").eq("id", userId).maybeSingle();
  if (data?.invite_code) return data.invite_code;
  for (let i = 0; i < 4; i++) {
    const code = newCode();
    const { error } = await db.from("profiles").update({ invite_code: code }).eq("id", userId).is("invite_code", null);
    if (!error) {
      const { data: again } = await db.from("profiles").select("invite_code").eq("id", userId).maybeSingle();
      if (again?.invite_code) return again.invite_code;
    }
  }
  throw new Error("invite code");
}

/** Extra scans earned (rewards) minus the ones already used. */
export async function bonusLeft(userId: string) {
  const db = supabaseAdmin();
  const [{ data: rows }, { data: p }] = await Promise.all([
    db.from("rewards").select("scans").eq("user_id", userId),
    db.from("profiles").select("bonus_used").eq("id", userId).maybeSingle(),
  ]);
  const earned = (rows ?? []).reduce((a, r) => a + (r.scans as number), 0);
  return { earned, used: p?.bonus_used ?? 0, left: Math.max(0, earned - (p?.bonus_used ?? 0)) };
}

export async function spendBonus(userId: string) {
  const db = supabaseAdmin();
  const { data: p } = await db.from("profiles").select("bonus_used").eq("id", userId).maybeSingle();
  await db.from("profiles").update({ bonus_used: (p?.bonus_used ?? 0) + 1 }).eq("id", userId);
}

/** Server-side funnel log for /admin (never blocks, never throws). */
export function logEvent(type: string, userId: string | null, detail?: string | null, amountCents?: number | null) {
  const write = async () => {
    try {
      await supabaseAdmin().from("events").insert({ type, user_id: userId, detail: detail ?? null, amount_cents: amountCents ?? null });
    } catch {}
  };
  // after(): runs once the response is sent, and the serverless function waits for it.
  try {
    after(write);
  } catch {
    void write();
  }
}

/** One-click unsubscribe token (HMAC of the user id). */
const secret = () => process.env.EMAIL_SECRET || process.env.CRON_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "dev";
export const unsubToken = (userId: string) => createHmac("sha256", secret()).update("unsub:" + userId).digest("base64url").slice(0, 32);
export function checkUnsub(userId: string, token: string) {
  const a = Buffer.from(unsubToken(userId));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
