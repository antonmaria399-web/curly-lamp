import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Repeat } from "lucide-react";
import { AUDIENCES } from "@/lib/seo";
import { MarketingShell, Hero, JsonLd } from "@/components/marketing/shell";
import { CTA } from "@/components/landing/bits";
import { Reveal } from "@/components/ui/reveal";
import { usd } from "@/lib/cn";

export const dynamicParams = false;
export function generateStaticParams() {
  return AUDIENCES.map((a) => ({ audience: a.slug }));
}

const monthly = (amount: number, cadence: string) => (cadence === "weekly" ? (amount * 52) / 12 : cadence === "yearly" ? amount / 12 : amount);

export async function generateMetadata({ params }: PageProps<"/for/[audience]">): Promise<Metadata> {
  const slug = (await params).audience;
  const a = AUDIENCES.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.intro.slice(0, 155),
    alternates: { canonical: `/for/${a.slug}` },
    openGraph: { title: a.title, description: a.intro.slice(0, 155), url: `/for/${a.slug}` },
  };
}

export default async function ForPage({ params }: PageProps<"/for/[audience]">) {
  const slug = (await params).audience;
  const a = AUDIENCES.find((x) => x.slug === slug);
  if (!a) notFound();
  const total = a.example.reduce((s, e) => s + monthly(e.amount, e.cadence), 0);
  return (
    <MarketingShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Budgeto",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          description: a.intro,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free first scan" },
        }}
      />
      <Hero label={`Budgeto for ${a.short.toLowerCase()}`} h1={a.h1} h1b={a.h1b} intro={a.intro}>
        <div className="mt-9 flex justify-center">
          <CTA />
        </div>
        <p className="num mt-5 text-[12px] uppercase tracking-[0.14em] text-white/45">Free to try · No bank login · Ready in seconds</p>
      </Hero>

      <section className="bg-paper py-20 text-ink sm:py-28">
        <div className="mx-auto grid max-w-[1040px] items-start gap-12 px-5 sm:px-8 md:grid-cols-2">
          <Reveal>
            <span className="label-mono text-zinc-500">[ Sounds familiar? ]</span>
            <h2 className="title-xl mt-4 text-[34px] sm:text-[46px]">Where it leaks</h2>
            <ul className="mt-6 space-y-3">
              {a.pains.map((p) => (
                <li key={p} className="flex gap-3 text-[17px]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-[#16a34a]" strokeWidth={3} /> {p}
                </li>
              ))}
            </ul>
            <p className="mt-8 rounded-2xl border border-black/[0.08] bg-white p-4 text-[15px] text-zinc-600">
              <b className="text-ink">Tip: </b>
              {a.tip}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-[22px] border border-black/10 bg-white p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.25)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Leak report</span>
                <span className="label-mono text-zinc-400">[ Example ]</span>
              </div>
              <div className="num mt-4 text-[44px] font-semibold leading-none tracking-tight text-[#e11d48]">
                {usd(total)}
                <span className="text-base font-normal text-zinc-400"> / mo</span>
              </div>
              <p className="num mt-1 text-sm text-zinc-500">= {usd(total * 12, 0)} a year</p>
              <ul className="mt-5 space-y-2">
                {a.example.map((e) => (
                  <li key={e.merchant} className="rounded-xl border border-black/[0.06] px-3.5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-lime ring-2 ring-lime/30" />
                      <span className="font-medium">{e.merchant}</span>
                      <span className="ledger-leader" />
                      <span className="num font-semibold text-[#e11d48]">−{usd(e.amount)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 pl-4 text-xs text-zinc-500">
                      <Repeat className="h-3 w-3" /> {e.cadence} · {e.why}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-zinc-400">Example values. Your report shows your own charges.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 text-center sm:py-28">
        <Reveal className="mx-auto max-w-[680px] px-5">
          <h2 className="title-xl text-[36px] sm:text-[52px]">
            Your statement, <span className="grad-text">read in seconds.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/60">Download last month&apos;s PDF from your bank app, drop it in, see every recurring charge.</p>
          <div className="mt-9 flex justify-center">
            <CTA />
          </div>
          <p className="mt-10 text-sm text-white/50">
            Also made for:{" "}
            {AUDIENCES.filter((x) => x.slug !== a.slug)
              .slice(0, 4)
              .map((x, i) => (
                <span key={x.slug}>
                  {i > 0 && " · "}
                  <Link href={`/for/${x.slug}`} className="underline-offset-4 hover:text-white hover:underline">
                    {x.short}
                  </Link>
                </span>
              ))}
          </p>
        </Reveal>
      </section>
    </MarketingShell>
  );
}
