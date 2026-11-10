import "server-only";

/**
 * Kwop = payments, plans and the owner's dashboard. Budgeto never talks to Whop directly.
 * KWOP_API is a secret (server only).
 */

export type KwopPlan = {
  id: number;
  name: string;
  price_cents: number;
  currency: string;
  interval: string;
  per_day: string;
  yearly: { price_cents: number; per_day: string } | null;
};

export type PlanState = { paid: boolean; plan: { id: number; name: string } | null; status: string | null; until: string | null };

const API = () => {
  const v = process.env.KWOP_API;
  if (!v) throw new Error("KWOP_API missing");
  // Tolerate copy-paste noise: spaces, quotes, a "KWOP_API=" prefix, trailing slash.
  const clean = v.trim().replace(/^KWOP_API=/, "").replace(/^["']|["']$/g, "").trim();
  // Keep only https://kwop.io/api/v2/app/<key>: drop anything pasted after the key (e.g. "/plans").
  const m = clean.match(/^https:\/\/kwop\.io\/api\/v2\/app\/[^/\s?#]+/);
  return m ? m[0] : clean.replace(/\/+$/, "");
};

async function kwop(path: string, init?: RequestInit & { timeoutMs?: number }) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), init?.timeoutMs ?? 10000);
  try {
    return await fetch(API() + path, {
      ...init,
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      cache: "no-store",
    });
  } finally {
    clearTimeout(t);
  }
}

let plansCache: { at: number; plans: KwopPlan[]; checkout: string | null } | null = null;

export async function getPlans(): Promise<{ plans: KwopPlan[]; checkout: string | null }> {
  if (plansCache && Date.now() - plansCache.at < 60_000) return plansCache;
  try {
    const r = await kwop("");
    if (!r.ok) throw new Error("kwop plans " + r.status);
    const j = await r.json();
    const plans = (j.plans as KwopPlan[]).slice().sort((a, b) => a.price_cents - b.price_cents);
    plansCache = { at: Date.now(), plans, checkout: j.checkout ?? null };
    return plansCache;
  } catch (e) {
    console.error("[kwop] plans failed", (e as Error).message);
    if (plansCache) return plansCache;
    return { plans: [], checkout: null };
  }
}

const planCache = new Map<string, { at: number; state: PlanState }>();

/** The ONLY source of truth for what a user paid for. Cached 60 s per email. */
export async function getPlan(email: string | null | undefined, opts: { fresh?: boolean } = {}): Promise<PlanState> {
  const none: PlanState = { paid: false, plan: null, status: null, until: null };
  if (!email) return none;
  const key = email.toLowerCase();
  // Local testing only (never in production): DEV_PAID="email:planId,email:planId" fakes a paid plan.
  if (process.env.NODE_ENV !== "production" && process.env.DEV_PAID) {
    const m = process.env.DEV_PAID.split(",").map((x) => x.split(":")).find(([e]) => e.toLowerCase() === key);
    if (m) return { paid: true, plan: { id: Number(m[1]), name: Number(m[1]) === 1645 ? "Budgeto Starter" : Number(m[1]) === 1647 ? "Budgeto Power" : "Budgeto Pro" }, status: "active", until: new Date(Date.now() + 20 * 86400000).toISOString() };
  }
  const hit = planCache.get(key);
  if (!opts.fresh && hit && Date.now() - hit.at < 60_000) return hit.state;
  try {
    const r = await kwop("/plan?email=" + encodeURIComponent(key));
    if (!r.ok) throw new Error("kwop plan " + r.status);
    const j = await r.json();
    const state: PlanState = { paid: Boolean(j.paid), plan: j.plan ?? null, status: j.status ?? null, until: j.until ?? null };
    planCache.set(key, { at: Date.now(), state });
    return state;
  } catch (e) {
    console.error("[kwop] getPlan failed, keeping last known plan", (e as Error).message);
    return hit?.state ?? none;
  }
}

export async function createCheckout(body: { plan: number; period: "month" | "year"; email: string; k?: string | null }) {
  const r = await kwop("/checkout", { method: "POST", body: JSON.stringify({ ...body, k: body.k || undefined }), timeoutMs: 15000 });
  const j = await r.json().catch(() => ({}));
  return { status: r.status, body: j as { embed?: string | null; ref?: string; fallback_url?: string; error?: string } };
}

export async function confirmCheckout(ref: string) {
  const r = await kwop("/confirm", { method: "POST", body: JSON.stringify({ ref }) });
  return (await r.json().catch(() => ({ ok: false, paid: false }))) as { ok: boolean; paid: boolean };
}

export async function cancelPlan(email: string, exceptRef?: string) {
  const r = await kwop("/cancel", { method: "POST", body: JSON.stringify({ email, ...(exceptRef ? { except_ref: exceptRef } : {}) }) });
  planCache.delete(email.toLowerCase());
  return (await r.json().catch(() => ({ message: "We couldn't reach billing. Try again in a minute." }))) as { message: string; manage_url?: string };
}

export type KwopEvent = "signup" | "onboarding_done" | "aha" | "paywall_view" | "feature_used";

/** Fire-and-forget: never blocks, never throws. */
export function track(type: KwopEvent, email: string | null | undefined, detail?: string) {
  if (!email || !process.env.KWOP_API) return;
  kwop("/event", { method: "POST", body: JSON.stringify({ type, email, ...(detail ? { detail } : {}) }), timeoutMs: 5000 }).catch(() => {});
}

export async function connectApp(url: string) {
  const r = await kwop("/connect", { method: "POST", body: JSON.stringify({ url }) });
  return r.json();
}
