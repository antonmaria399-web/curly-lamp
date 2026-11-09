import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Logo } from "@/components/ui/logo";
import { usd } from "@/lib/cn";
import type { ReportResult } from "@/lib/types";

async function load(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await supabaseAdmin().from("reports").select("result, shared").eq("id", id).maybeSingle();
  if (!data?.shared) return null;
  return data.result as ReportResult;
}

export async function generateMetadata({ params }: PageProps<"/s/[id]">): Promise<Metadata> {
  const r = await load((await params).id);
  if (!r) return { title: "Budgeto" };
  return {
    title: `${usd(r.monthly_leaks)} a month in leaks, found with Budgeto`,
    description: "Drop your bank statement PDF. Budgeto's AI finds the subscriptions you forgot you pay.",
    robots: { index: false },
  };
}

/** Public, shared result: totals only (no merchant list, no bank, no file name). */
export default async function SharedPage({ params }: PageProps<"/s/[id]">) {
  const r = await load((await params).id);
  if (!r) notFound();
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-night px-5 text-center text-white">
      <div className="dot-grid pointer-events-none absolute inset-0" />
      <div className="top-glow pointer-events-none absolute inset-0" />
      <div className="relative">
        <Logo dark />
        <p className="mt-10 text-white/60">Someone found</p>
        <p className="num mt-2 text-[56px] font-semibold tracking-tight text-lime sm:text-[88px]">{usd(r.monthly_leaks)}</p>
        <p className="text-white/60">a month in forgotten subscriptions and fees ({r.leaks.length} charges).</p>
        <Link href="/" className="btn-main mt-10 inline-flex h-16 items-center rounded-full bg-lime px-8 text-[17px] font-semibold text-ink">
          Find my leaks
        </Link>
        <p className="num mt-4 text-xs uppercase tracking-[0.14em] text-white/40">Free to try · No bank login</p>
      </div>
    </main>
  );
}
