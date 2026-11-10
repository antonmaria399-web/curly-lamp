import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Footer } from "@/components/landing/chrome";
import { FAQ } from "@/components/landing/bits";
import { DISAMBIGUATION, FEATURES, ONE_LINER, SHORT } from "@/lib/identity";
import { geoFaq, getPricing, ldJson, pageJsonLd } from "@/lib/geo";
import { LIMITS, TAGS } from "@/lib/quotas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What is Budgeto?",
  description: ONE_LINER,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "What is Budgeto?", description: ONE_LINER },
};

const usd = (c: number) => "$" + (c % 100 === 0 ? c / 100 : (c / 100).toFixed(2));

export default async function About() {
  const plans = await getPricing();
  const faq = geoFaq(plans);
  return (
    <main className="bg-night text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(pageJsonLd({ path: "/about", title: "What is Budgeto?", plans, faq, about: true })) }} />
      <TopBar />

      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[760px] px-4 sm:px-8">
          <span className="label-mono text-white/60">[ About ]</span>
          <h1 className="title-xl mt-5 text-[42px] sm:text-[64px]">What is Budgeto?</h1>
          <p className="mt-6 text-[19px] leading-relaxed text-white/85 sm:text-[22px]">{ONE_LINER}</p>
          <p className="mt-5 text-[17px] leading-relaxed text-white/60">{SHORT}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/?home=1#scan" className="inline-flex h-12 items-center rounded-full bg-lime px-6 font-semibold text-ink transition hover:brightness-95">
              Find my leaks →
            </Link>
            <Link href="/?home=1#how" className="inline-flex h-12 items-center rounded-full px-5 font-medium text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,.15)] hover:text-white">
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20 text-ink sm:py-28">
        <div className="mx-auto max-w-[760px] space-y-14 px-5 sm:px-8">
          <div>
            <span className="label-mono text-zinc-500">[ Who it is for ]</span>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight sm:text-[36px]">People who want to save more money</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-zinc-600">{faq[1].a}</p>
          </div>

          <div>
            <span className="label-mono text-zinc-500">[ How it works ]</span>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight sm:text-[36px]">One PDF in, every leak out</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-[17px] leading-relaxed text-zinc-600">
              <li>Download last month&apos;s statement PDF from your bank&apos;s website or app (Chase, Bank of America, Wells Fargo, Capital One, Citi, Amex, credit unions…).</li>
              <li>Drop it on the Budgeto home page. The AI reads every line in about 5 to 15 seconds.</li>
              <li>Your leak report lists each recurring charge and fee with its amount and how often it bills. Cancel what you don&apos;t use with the steps given, and track the savings.</li>
            </ol>
            <p className="mt-3 text-[15px] text-zinc-500">The PDF is read once and never stored. Budgeto never asks for your bank password and cannot move money.</p>
          </div>

          <div>
            <span className="label-mono text-zinc-500">[ Features ]</span>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight sm:text-[36px]">What Budgeto does</h2>
            <dl className="mt-5 divide-y divide-black/[0.07] rounded-[20px] border border-black/[0.08] bg-white">
              {FEATURES.map(([t, d]) => (
                <div key={t} className="p-5">
                  <dt className="font-semibold">{t}</dt>
                  <dd className="mt-1 text-zinc-600">{d}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <span className="label-mono text-zinc-500">[ Prices ]</span>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight sm:text-[36px]">How much Budgeto costs</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-zinc-600">{faq[2].a}</p>
            <div className="mt-5 overflow-hidden rounded-[20px] border border-black/[0.08] bg-white">
              <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-2 border-b border-black/[0.06] bg-zinc-50 px-4 py-3 text-[13px] font-semibold sm:px-6">
                <span>Plan</span>
                <span>Monthly</span>
                <span>Yearly</span>
              </div>
              <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-2 border-b border-black/[0.05] px-4 py-4 text-[15px] sm:px-6">
                <span>
                  <b className="font-semibold">Free try</b>
                  <span className="block text-[13px] text-zinc-500">{LIMITS[0].scans} scans a day, first leak shown</span>
                </span>
                <span className="num">$0</span>
                <span className="num">$0</span>
              </div>
              {plans.map((p, i) => {
                const tier = Math.min(3, Math.max(1, i + 1 - Math.max(0, plans.length - 3))) as 1 | 2 | 3;
                return (
                  <div key={p.id} className="grid grid-cols-[1.3fr_1fr_1fr] gap-2 border-b border-black/[0.05] px-4 py-4 text-[15px] last:border-0 sm:px-6">
                    <span>
                      <b className="font-semibold">{p.name.replace(/^Budgeto\s+/i, "")}</b>
                      <span className="block text-[13px] text-zinc-500">
                        {LIMITS[tier].scans} scans a month · {TAGS[tier]}
                      </span>
                    </span>
                    <span className="num">{usd(p.price_cents)}/mo</span>
                    <span className="num">{p.yearly ? `${usd(p.yearly.price_cents)}/yr` : "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <span className="label-mono text-zinc-500">[ Not to be confused with ]</span>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-600">{DISAMBIGUATION}</p>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-paper pb-24 text-ink sm:pb-32 [--line:rgba(10,11,10,.1)] [--muted:#52525b]">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <span className="label-mono text-zinc-500">[ Questions ]</span>
          <h2 className="mb-8 mt-3 text-[28px] font-semibold tracking-tight sm:text-[36px]">Budgeto in five answers</h2>
          <FAQ items={faq} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
