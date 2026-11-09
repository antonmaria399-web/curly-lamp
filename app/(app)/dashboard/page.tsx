import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";
import { getViewer, periodStart, scansUsed } from "@/lib/viewer";
import { myActions, myProfile, myReports } from "@/lib/data";
import { AppScanner, AutoUnlock, GoalCard, ReportList } from "@/components/app/bits";
import { LeakMeter } from "@/components/funnel/report";
import { usd } from "@/lib/cn";

export const metadata: Metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const viewer = await getViewer();
  const [reports, actions, profile] = await Promise.all([myReports(viewer, 20), myActions(), myProfile()]);
  const latest = reports[0] ?? null;

  // Not paid yet: they land on their own result, under the paywall.
  if (!viewer.plan.paid) {
    return (
      <div>
        <AutoUnlock />
        <h1 className="text-[30px] font-semibold tracking-[-0.03em]">{latest ? "Your leak report" : "Find your leaks"}</h1>
        <p className="mt-1 text-muted">{latest ? "It's saved. Unlock it to see every leak and the total." : "Drop your last statement PDF. It takes about 5 seconds."}</p>
        <div className="mt-6">
          <AppScanner initial={latest} />
        </div>
      </div>
    );
  }

  const used = await scansUsed(viewer.user!.id, periodStart(viewer.plan.until));
  const saved = actions.filter((a) => a.status === "cancelled").reduce((s, a) => s + Number(a.monthly), 0);
  const full = latest && !("locked" in latest.result) ? latest.result : null;
  const first = viewer.user!.email.split("@")[0];

  return (
    <div className="space-y-8">
      <AutoUnlock />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Hi {profile?.name || first}</p>
          <h1 className="text-[30px] font-semibold tracking-[-0.03em]">Your money, at a glance</h1>
        </div>
        <Link href="/upload" className="inline-flex h-11 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-ink active:scale-95">
          <Upload className="h-4 w-4" /> Scan a statement
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[20px] border border-line bg-surface p-5">
          {full ? (
            <>
              <LeakMeter monthly={full.monthly_leaks} yearly={full.yearly_leaks} />
              <Link href={`/reports/${latest!.id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                Open your latest report <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <div>
              <div className="label-mono text-muted">[ Leaking every month ]</div>
              <p className="mt-3 text-muted">Scan your first statement to see what&apos;s leaking.</p>
              <Link href="/upload" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                Find my leaks <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
        <div className="grid gap-4">
          <div className="rounded-[20px] border border-line bg-surface p-5">
            <div className="label-mono text-muted">[ Saved so far ]</div>
            <div className="num mt-2 text-[34px] font-semibold leading-none text-gain">+{usd(saved)}<span className="text-base font-normal text-muted">/mo</span></div>
            <p className="num mt-1.5 text-sm text-muted">= {usd(saved * 12)} a year</p>
          </div>
          <div className="rounded-[20px] border border-line bg-surface p-5">
            <div className="label-mono text-muted">[ Scans this month ]</div>
            <div className="num mt-2 text-2xl font-semibold">
              {used} <span className="text-base font-normal text-muted">/ {viewer.limits.scans}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-fg" style={{ width: `${Math.min(100, (used / viewer.limits.scans) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <GoalCard goal={profile?.goal_monthly ? Number(profile.goal_monthly) : null} saved={saved} enabled={viewer.limits.goals} />

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Recent reports</h2>
          <Link href="/upload" className="text-sm text-muted underline-offset-4 hover:underline">
            All reports
          </Link>
        </div>
        <ReportList
          reports={reports.slice(0, 5).map((r) => ({
            id: r.id,
            file_name: r.file_name,
            created_at: r.created_at,
            monthly: "locked" in r.result ? null : r.result.monthly_leaks,
            leaks: "locked" in r.result ? r.result.leaks_count + r.result.fees_count : r.result.leaks.length + r.result.fees.length,
          }))}
        />
      </section>
    </div>
  );
}
