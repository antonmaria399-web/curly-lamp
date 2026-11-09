import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clapperboard, Lock } from "lucide-react";
import { getViewer } from "@/lib/viewer";
import { myActions, view } from "@/lib/data";
import { supabaseServer } from "@/lib/supabase/server";
import { AppScanner, InteractiveReport, ShareButton, UpgradeLink } from "@/components/app/bits";

export const metadata: Metadata = { title: "Leak report" };

export default async function ReportPage({ params }: PageProps<"/reports/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const viewer = await getViewer();
  const sb = await supabaseServer();
  const { data } = await sb.from("reports").select("id, file_name, created_at, shared, result").eq("id", id).maybeSingle();
  if (!data) notFound();
  const report = view(viewer, data as never);
  const actions = Object.fromEntries((await myActions()).map((a) => [a.merchant_key, a.status as "keep" | "cancelled"]));
  const locked = "locked" in report.result;
  const r = report.result;

  return (
    <div>
      <Link href="/upload" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> All reports
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-[28px] font-semibold tracking-[-0.03em]">{report.file_name}</h1>
          <p className="num mt-1 text-sm text-muted">
            {r.bank ? `${r.bank} · ` : ""}
            {r.period ? `${r.period} · ` : ""}
            {r.transactions_count} transactions
          </p>
        </div>
        {!locked && (
          <div className="flex gap-2">
            <ShareButton id={report.id} shared={report.shared} />
            {viewer.limits.export ? (
              <Link href={`/export/${report.id}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-[15px] font-semibold hover:bg-surface-2">
                <Clapperboard className="h-4 w-4" /> Export
              </Link>
            ) : (
              <UpgradeLink tier={2} className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-[15px] font-semibold text-muted">
                <Lock className="h-4 w-4" /> Export
              </UpgradeLink>
            )}
          </div>
        )}
      </div>
      <div className="mt-8">{locked ? <AppScanner initial={report} /> : <InteractiveReport report={report} actions={actions} />}</div>
    </div>
  );
}
