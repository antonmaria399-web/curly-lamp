import "server-only";
import { supabaseServer } from "./supabase/server";
import { lock, gate } from "./redact";
import type { Viewer } from "./viewer";
import type { Leak, LockedResult, ReportResult } from "./types";

export type ViewReport = { id: string; file_name: string; created_at: string; shared: boolean; result: LockedResult | (ReportResult & { fees_locked?: number }) };

export function view(viewer: Viewer, row: { id: string; file_name: string | null; created_at: string; shared: boolean; result: ReportResult }): ViewReport {
  return {
    id: row.id,
    file_name: row.file_name || "Statement",
    created_at: row.created_at,
    shared: row.shared,
    result: viewer.tier === 0 ? lock(row.result) : gate(row.result, { fees: viewer.limits.fees }),
  };
}

/** The user's reports within their plan's history window (RLS: only their own rows). */
export async function myReports(viewer: Viewer, limit = 50) {
  const sb = await supabaseServer();
  let q = sb.from("reports").select("id, file_name, created_at, shared, result").order("created_at", { ascending: false }).limit(limit);
  if (viewer.tier > 0) q = q.gte("created_at", new Date(Date.now() - viewer.limits.historyMonths * 31 * 86400000).toISOString());
  const { data } = await q;
  return (data ?? []).map((r) => view(viewer, r as never));
}

export async function myActions() {
  const sb = await supabaseServer();
  const { data } = await sb.from("leak_actions").select("merchant_key, merchant, monthly, status, updated_at");
  return data ?? [];
}

export async function myProfile() {
  const sb = await supabaseServer();
  const { data } = await sb.from("profiles").select("*").maybeSingle();
  return data;
}

/** All leaks across reports, the most recent occurrence of each merchant. */
export function allLeaks(reports: ViewReport[]) {
  const map = new Map<string, Leak & { report_id: string; report_date: string }>();
  for (const r of reports.slice().reverse()) {
    if ("locked" in r.result) continue;
    for (const l of [...r.result.leaks, ...r.result.fees]) map.set(l.key, { ...l, report_id: r.id, report_date: r.created_at });
  }
  return [...map.values()].sort((a, b) => b.monthly - a.monthly);
}
