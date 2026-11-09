import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Lock } from "lucide-react";
import { getViewer } from "@/lib/viewer";
import { supabaseServer } from "@/lib/supabase/server";
import { UpgradeLink } from "@/components/app/bits";

export const metadata: Metadata = { title: "Faceless Export" };

export default async function ExportPage({ params }: PageProps<"/export/[id]">) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const viewer = await getViewer();
  const sb = await supabaseServer();
  const { data } = await sb.from("reports").select("id, file_name").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <div>
      <Link href={`/reports/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> Back to the report
      </Link>
      <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.03em]">Faceless Export</h1>
      <p className="mt-1 text-muted">Clean stat screens (1080×1920) for TikTok, Reels and Shorts. No name, no account numbers, no bank logo.</p>
      {!viewer.limits.export ? (
        <UpgradeLink tier={2} className="mt-8 flex w-full items-center justify-center gap-2 rounded-[20px] border border-line bg-surface p-10 font-semibold">
          <Lock className="h-4 w-4" /> Unlock with Pro
        </UpgradeLink>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <figure key={i} className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/export/${id}/${i}`} alt={`Stat screen ${i + 1}`} className="aspect-[9/16] w-full rounded-xl border border-line bg-night object-cover" loading="lazy" />
              <a href={`/api/export/${id}/${i}?dl=1`} download={`budgeto-${i + 1}.png`} className="flex h-9 items-center justify-center gap-1.5 rounded-full border border-line text-xs font-medium hover:bg-surface-2">
                <Download className="h-3.5 w-3.5" /> Download
              </a>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
