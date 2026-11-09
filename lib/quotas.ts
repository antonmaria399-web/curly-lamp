import type { KwopPlan } from "./kwop";

/**
 * Quotas per plan. Plans come from Kwop (never hardcoded); their rank by price picks the tier:
 * cheapest = tier 1 (Starter), middle = tier 2 (Pro, recommended), most expensive = tier 3 (Power).
 * Counted on the server per billing period (30 days ending at the plan's renewal date).
 */
export type Tier = 0 | 1 | 2 | 3;

export type Limits = {
  scans: number; // statement scans per billing period
  historyMonths: number;
  fees: boolean; // Hidden Fee Hunter: bank fees + deep recurring detection
  goals: boolean; // Savings Goal Tracker
  export: boolean; // Faceless Export
  compare: boolean; // comparison over time / across banks
  rules: boolean; // custom savings rules
};

export const LIMITS: Record<Tier, Limits> = {
  0: { scans: 3, historyMonths: 0, fees: false, goals: false, export: false, compare: false, rules: false }, // free tries / day
  1: { scans: 10, historyMonths: 3, fees: false, goals: true, export: false, compare: false, rules: false },
  2: { scans: 30, historyMonths: 12, fees: true, goals: true, export: true, compare: false, rules: false },
  3: { scans: 100, historyMonths: 36, fees: true, goals: true, export: true, compare: true, rules: true },
};

export const TAGS: Record<1 | 2 | 3, string> = {
  1: "For a quick monthly check-up",
  2: "For people serious about saving",
  3: "For every account you have",
};

export const UNLOCKS: Record<1 | 2 | 3, string[]> = {
  1: [
    "Your full leak report: every subscription and the total",
    "10 statement scans a month",
    "Category breakdown of your spending",
    "Step-by-step cancel help for each leak",
    "Savings tracker + 3 months of history",
  ],
  2: [
    "Everything in Starter, with 30 scans a month",
    "Hidden Fee Hunter: overdraft, ATM and account fees",
    "Savings goal tracker with your monthly target",
    "Faceless Export: clean stat screens for your videos",
    "12 months of report history",
  ],
  3: [
    "Everything in Pro, with 100 scans a month",
    "Compare months and banks side by side",
    "Custom savings rules (flag anything over $X)",
    "36 months of report history",
    "Priority scans when traffic is high",
  ],
};

export const ADDS: Record<2 | 3, string[]> = {
  2: ["30 scans a month instead of 10", "Hidden Fee Hunter finds bank fees too", "Faceless Export for your videos"],
  3: ["100 scans a month", "Compare months and banks side by side", "Custom savings rules"],
};

export function tierOf(plans: KwopPlan[], planId: number | null | undefined): Tier {
  if (!planId) return 0;
  const sorted = plans.slice().sort((a, b) => a.price_cents - b.price_cents);
  const i = sorted.findIndex((p) => p.id === planId);
  if (i < 0) return 1; // paid but unknown plan: at least Starter
  if (sorted.length === 1) return 2;
  if (sorted.length === 2) return i === 0 ? 1 : 3;
  return Math.min(3, Math.max(1, i + 1 - Math.max(0, sorted.length - 3))) as Tier;
}

export function planForTier(plans: KwopPlan[], tier: 1 | 2 | 3): KwopPlan | null {
  const sorted = plans.slice().sort((a, b) => a.price_cents - b.price_cents);
  if (sorted.length === 0) return null;
  const idx = Math.min(sorted.length - 1, tier - 1 + Math.max(0, sorted.length - 3));
  return sorted[idx] ?? null;
}

export const shortName = (name: string) => name.replace(/^Budgeto\s+/i, "");
