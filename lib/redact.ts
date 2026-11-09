import type { LockedResult, ReportResult } from "./types";

/** What a viewer without a plan may receive: the proof it's real (leak #1), never the totals or the other leaks. */
export function lock(r: ReportResult): LockedResult {
  return {
    locked: true,
    bank: r.bank,
    period: r.period,
    transactions_count: r.transactions_count,
    leaks_count: r.leaks.length,
    fees_count: r.fees.length,
    first_leak: r.leaks[0] ?? r.fees[0] ?? null,
    categories_count: r.categories.length,
  };
}

/** Plan-level gating on a full result (e.g. Starter doesn't get the Hidden Fee Hunter list). */
export function gate(r: ReportResult, opts: { fees: boolean }): ReportResult & { fees_locked?: number } {
  if (opts.fees) return r;
  const feeTotal = r.fees.reduce((a, f) => a + f.monthly, 0);
  return {
    ...r,
    fees: [],
    fees_locked: r.fees.length,
    monthly_leaks: Math.round((r.monthly_leaks - feeTotal) * 100) / 100,
    yearly_leaks: Math.round((r.monthly_leaks - feeTotal) * 12 * 100) / 100,
  };
}

export function isLocked(r: unknown): r is LockedResult {
  return Boolean(r && typeof r === "object" && (r as LockedResult).locked);
}
