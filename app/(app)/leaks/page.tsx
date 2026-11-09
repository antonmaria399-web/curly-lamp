import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Lock, Plus, Minus } from "lucide-react";
import { getViewer } from "@/lib/viewer";
import { allLeaks, myActions, myReports } from "@/lib/data";
import { LeaksBoard } from "@/components/app/leaks-board";
import { UnlockButton, UpgradeLink } from "@/components/app/bits";
import { usd } from "@/lib/cn";
import type { ReportResult } from "@/lib/types";

export const metadata: Metadata = { title: "Leaks" };

export default async function LeaksPage() {
  const viewer = await getViewer();
  const [reports, actions] = await Promise.all([myReports(viewer), myActions()]);

  if (!viewer.plan.paid) {
    return (
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.03em]">Leaks</h1>
        <p className="mt-1 text-muted">Every subscription and fee across your statements, in one list.</p>
        <div className="mt-8 rounded-[20px] border border-line bg-surface p-8 text-center">
          <Lock className="mx-auto h-6 w-6" />
          <p className="mx-auto mt-3 max-w-sm text-muted">{reports.length ? "Your leaks are found. Unlock your report to see and track them here." : "Scan a statement first, then your leaks show up here."}</p>
          <div className="mt-5 flex justify-center">{reports.length ? <UnlockButton /> : <Link href="/upload" className="inline-flex h-12 items-center rounded-full bg-lime px-6 font-semibold text-ink">Find my leaks</Link>}</div>
        </div>
      </div>
    );
  }

  const leaks = allLeaks(reports);
  const full = reports.filter((r) => !("locked" in r.result)) as (typeof reports[number] & { result: ReportResult })[];
  const actionMap = Object.fromEntries(actions.map((a) => [a.merchant_key, a.status as "keep" | "cancelled"]));

  // Comparison over time (Power): month by month totals, and what changed between the last two statements.
  const series = full.slice(0, 6).reverse();
  const [cur, prev] = [full[0], full[1]];
  const newOnes = cur && prev ? cur.result.leaks.filter((l) => !prev.result.leaks.some((p) => p.key === l.key)) : [];
  const gone = cur && prev ? prev.result.leaks.filter((l) => !cur.result.leaks.some((p) => p.key === l.key)) : [];
  const hikes = cur && prev ? cur.result.leaks.flatMap((l) => { const p = prev.result.leaks.find((x) => x.key === l.key); return p && l.amount > p.amount + 0.01 ? [{ l, from: p.amount }] : []; }) : [];
  const maxSeries = Math.max(1, ...series.map((s) => s.result.monthly_leaks));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.03em]">Leaks</h1>
        <p className="mt-1 text-muted">Every recurring charge we found. Tap one for how to stop it, then mark what you did.</p>
        <p className="mt-2 text-xs text-muted">Budgeto can&apos;t see which apps you still open. You decide what stays.</p>
      </div>

      <LeaksBoard leaks={leaks} actions={actionMap} />

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Compare over time</h2>
          {!viewer.limits.compare && <span className="label-mono text-muted">[ Power ]</span>}
        </div>
        {!viewer.limits.compare ? (
          <UpgradeLink tier={3} className="relative block w-full overflow-hidden rounded-[20px] border border-line bg-surface p-6 text-left">
            <div className="locked-blur flex h-32 items-end gap-3" aria-hidden>
              {[60, 85, 72, 50, 40, 30].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-lg bg-fg/20" style={{ height: `${h}%` }} />
              ))}
            </div>
            <span className="absolute inset-0 flex items-center justify-center gap-2 bg-bg/30 text-sm font-semibold">
              <Lock className="h-4 w-4" /> See new leaks, price hikes and months side by side · Unlock with Power
            </span>
          </UpgradeLink>
        ) : series.length < 2 ? (
          <p className="rounded-[20px] border border-line bg-surface p-6 text-sm text-muted">Scan one more statement (another month or another bank) to compare.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-[20px] border border-line bg-surface p-5">
              <div className="flex h-40 items-end gap-3">
                {series.map((s) => (
                  <div key={s.id} className="flex flex-1 flex-col items-center gap-2">
                    <span className="num text-xs text-muted">{usd(s.result.monthly_leaks, 0)}</span>
                    <div className="w-full rounded-t-lg bg-loss/70" style={{ height: `${(s.result.monthly_leaks / maxSeries) * 100}%`, minHeight: 4 }} />
                    <span className="max-w-full truncate text-[11px] text-muted">{s.result.period?.split(/[-–]/)[0]?.trim() || new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[20px] border border-line bg-surface p-4">
                <div className="label-mono flex items-center gap-1.5 text-loss"><Plus className="h-3 w-3" /> New</div>
                {newOnes.length ? newOnes.map((l) => <p key={l.key} className="mt-2 flex justify-between text-sm"><span>{l.merchant}</span><span className="num text-loss">{usd(l.monthly)}</span></p>) : <p className="mt-2 text-sm text-muted">Nothing new.</p>}
              </div>
              <div className="rounded-[20px] border border-line bg-surface p-4">
                <div className="label-mono flex items-center gap-1.5 text-loss"><ArrowUpRight className="h-3 w-3" /> Price went up</div>
                {hikes.length ? hikes.map(({ l, from }) => <p key={l.key} className="mt-2 flex justify-between text-sm"><span>{l.merchant}</span><span className="num">{usd(from)} → <span className="text-loss">{usd(l.amount)}</span></span></p>) : <p className="mt-2 text-sm text-muted">No price hikes.</p>}
              </div>
              <div className="rounded-[20px] border border-line bg-surface p-4">
                <div className="label-mono flex items-center gap-1.5 text-gain"><Minus className="h-3 w-3" /> Gone</div>
                {gone.length ? gone.map((l) => <p key={l.key} className="mt-2 flex justify-between text-sm"><span>{l.merchant}</span><span className="num text-gain">{usd(l.monthly)}</span></p>) : <p className="mt-2 text-sm text-muted">Nothing stopped yet.</p>}
              </div>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted"><ArrowDownRight className="h-3.5 w-3.5" /> Comparing your two latest statements.</p>
          </div>
        )}
      </section>
    </div>
  );
}
