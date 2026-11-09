import type { Metadata } from "next";
import { getViewer, periodStart, scansUsed } from "@/lib/viewer";
import { myReports } from "@/lib/data";
import { AppScanner, ReportList, UpgradeLink } from "@/components/app/bits";

export const metadata: Metadata = { title: "Upload" };

export default async function UploadPage() {
  const viewer = await getViewer();
  const reports = await myReports(viewer);
  const used = viewer.plan.paid ? await scansUsed(viewer.user!.id, periodStart(viewer.plan.until)) : null;
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.03em]">Scan a statement</h1>
        <p className="mt-1 text-muted">
          PDF from your bank or card, or a clear photo. We read it once and never store the file.
          {used !== null && (
            <>
              {" "}
              <span className="num">
                {used}/{viewer.limits.scans} scans used this month.
              </span>
              {viewer.tier < 3 && (
                <>
                  {" "}
                  <UpgradeLink className="font-medium text-fg underline underline-offset-4">Need more?</UpgradeLink>
                </>
              )}
            </>
          )}
        </p>
        <div className="mt-6">
          <AppScanner compact />
        </div>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your reports</h2>
        <ReportList
          reports={reports.map((r) => ({
            id: r.id,
            file_name: r.file_name,
            created_at: r.created_at,
            monthly: "locked" in r.result ? null : r.result.monthly_leaks,
            leaks: "locked" in r.result ? r.result.leaks_count + r.result.fees_count : r.result.leaks.length + r.result.fees.length,
          }))}
        />
        {viewer.tier > 0 && <p className="mt-3 text-xs text-muted">Your plan keeps {viewer.limits.historyMonths} months of reports.</p>}
      </section>
    </div>
  );
}
