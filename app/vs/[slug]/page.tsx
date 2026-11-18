import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { PublicPage, appLd, faqLd } from "@/components/landing/public-page";
import { CTA, FAQ } from "@/components/landing/bits";
import { Reveal } from "@/components/ui/reveal";
import { COMPETITORS } from "@/lib/pages-content";
import { canonical } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPETITORS.find((x) => x.slug === slug);
  if (!c) return {};
  const url = canonical(`/vs/${c.slug}`);
  return { title: c.title, description: c.description, alternates: { canonical: url }, openGraph: { url, title: c.title, description: c.description } };
}

export default async function VsPage({ params }: PageProps<"/vs/[slug]">) {
  const { slug } = await params;
  const c = COMPETITORS.find((x) => x.slug === slug);
  if (!c) notFound();
  const faq = [
    { q: `Can I use Budgeto and ${c.name} together?`, a: `Yes. Budgeto doesn't replace a budget: it's a quick check of one statement. Some people scan with Budgeto first, then keep tracking in ${c.name}.` },
    { q: "Why doesn't Budgeto link my bank?", a: "Because many people don't want to give an app their bank login. The PDF statement you already have holds everything needed to find recurring charges." },
    { q: "How much does Budgeto cost?", a: "You try it free first. The plans show up once your first leak report is ready, and you can cancel in two taps." },
  ];
  const url = canonical(`/vs/${c.slug}`);
  return (
    <PublicPage jsonLd={[appLd(url), faqLd(faq)]}>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[860px] px-5 text-center sm:px-8">
          <Reveal>
            <span className="label-mono text-white/60">[ An honest comparison ]</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="title-xl mt-5 text-[40px] sm:text-[68px]">
              Budgeto vs {c.name}.
              <br />
              <span className="grad-text">Different jobs.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-relaxed text-white/65">
              {c.name} and Budgeto both help you keep more of your paycheck, in very different ways. Here&apos;s what each one does, on verifiable facts.
            </p>
          </Reveal>
          <Reveal delay={0.18} className="mt-10 flex justify-center">
            <CTA />
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 text-ink sm:py-28">
        <div className="mx-auto max-w-[980px] px-5 sm:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal className="rounded-[22px] border border-black/[0.08] bg-white p-6">
              <div className="label-mono text-zinc-500">[ {c.name} ]</div>
              <p className="mt-3 text-zinc-700">{c.what}</p>
              <p className="mt-4 text-sm"><span className="font-semibold">Price: </span><span className="text-zinc-600">{c.price}</span></p>
              <p className="mt-2 text-sm"><span className="font-semibold">Best at: </span><span className="text-zinc-600">{c.bestAt}</span></p>
            </Reveal>
            <Reveal delay={0.08} className="rounded-[22px] border-2 border-ink bg-white p-6">
              <div className="label-mono text-zinc-500">[ Budgeto ]</div>
              <p className="mt-3 text-zinc-700">
                A statement scanner: you drop the bank statement PDF you already have (or a photo), and its AI lists every subscription, repeat charge and bank fee, with the monthly total and how to stop each one. No bank login.
              </p>
              <p className="mt-4 text-sm"><span className="font-semibold">Price: </span><span className="text-zinc-600">Free to try. Plans show up after your first report.</span></p>
              <p className="mt-2 text-sm"><span className="font-semibold">Best at: </span><span className="text-zinc-600">Finding forgotten subscriptions and fees in seconds, without sharing your bank login.</span></p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-[22px] border border-black/[0.08] bg-white">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-black/[0.06] bg-zinc-50 px-4 py-3 text-[13px] font-semibold sm:px-6">
              <span />
              <span className="text-zinc-500">{c.name}</span>
              <span>Budgeto</span>
            </div>
            {c.rows.map(([t, a, b]) => (
              <div key={t} className="grid grid-cols-[1.1fr_1fr_1fr] items-start gap-2 border-b border-black/[0.05] px-4 py-4 text-[14px] last:border-0 sm:px-6 sm:text-[15px]">
                <span className="font-medium">{t}</span>
                <span className="flex items-start gap-1.5 text-zinc-500">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  {a}
                </span>
                <span className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" strokeWidth={3} />
                  {b}
                </span>
              </div>
            ))}
          </Reveal>
          <p className="mt-4 text-xs text-zinc-500">{c.name} facts from its public website, checked November 2026. Prices and features can change: check their site.</p>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Reveal className="rounded-[22px] bg-zinc-100 p-6">
              <h2 className="font-semibold">Pick {c.name} if…</h2>
              <p className="mt-2 text-zinc-600">{c.pick.them}</p>
            </Reveal>
            <Reveal delay={0.08} className="rounded-[22px] bg-lime p-6">
              <h2 className="font-semibold">Pick Budgeto if…</h2>
              <p className="mt-2 text-ink/80">{c.pick.us}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-paper pb-24 text-ink [--line:rgba(10,11,10,.1)] [--muted:#52525b]">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <FAQ items={faq} />
          <p className="mt-8 text-center text-sm text-zinc-500">
            Other comparisons:{" "}
            {COMPETITORS.filter((x) => x.slug !== c.slug).map((x, i, arr) => (
              <span key={x.slug}>
                <Link href={`/vs/${x.slug}`} className="font-medium text-ink underline-offset-4 hover:underline">
                  Budgeto vs {x.name}
                </Link>
                {i < arr.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden py-28 text-center sm:py-32">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto max-w-[760px] px-5">
          <h2 className="title-xl text-[38px] sm:text-[60px]">
            See it on your own statement.
            <br />
            <span className="grad-text">5 seconds, no login.</span>
          </h2>
          <div className="mt-10 flex justify-center">
            <CTA />
          </div>
        </Reveal>
      </section>
    </PublicPage>
  );
}
