import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { COMPETITORS } from "@/lib/seo";
import { MarketingShell, Hero, JsonLd } from "@/components/marketing/shell";
import { CTA } from "@/components/landing/bits";
import { Reveal } from "@/components/ui/reveal";

export const dynamicParams = false;
export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vs/[competitor]">): Promise<Metadata> {
  const slug = (await params).competitor;
  const c = COMPETITORS.find((x) => x.slug === slug);
  if (!c) return {};
  const d = `An honest comparison of Budgeto and ${c.name}: what each does, what each costs, and what each is best at.`;
  return { title: c.title, description: d, alternates: { canonical: `/vs/${c.slug}` }, openGraph: { title: c.title, description: d, url: `/vs/${c.slug}` } };
}

export default async function VsPage({ params }: PageProps<"/vs/[competitor]">) {
  const slug = (await params).competitor;
  const c = COMPETITORS.find((x) => x.slug === slug);
  if (!c) notFound();
  const faq = [
    { q: `Is Budgeto a ${c.name} alternative?`, a: `For one job, yes: finding the subscriptions and fees you forgot. ${c.name} is best at ${c.bestAt.charAt(0).toLowerCase() + c.bestAt.slice(1)}` },
    { q: "Do I need to link my bank to Budgeto?", a: "No. You upload the PDF statement you already get from your bank. Budgeto never asks for your bank password." },
    { q: "Can I use both?", a: `Yes. Many people scan a statement with Budgeto to find leaks fast, and use a full budgeting app like ${c.name} for the rest.` },
  ];
  return (
    <MarketingShell>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <Hero label={`Budgeto vs ${c.name}`} h1={`Budgeto vs ${c.name}.`} h1b="An honest comparison." intro={`Both help you spend less. They do it in very different ways. Here is what each one does, on facts you can check.`} />

      <section className="bg-paper py-20 text-ink sm:py-28">
        <div className="mx-auto max-w-[920px] px-5 sm:px-8">
          <Reveal className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[22px] border border-black/[0.08] bg-white p-6">
              <div className="label-mono text-zinc-500">[ {c.name} ]</div>
              <p className="mt-3 text-[16px]">{c.what}</p>
              <p className="mt-4 text-sm text-zinc-600">
                <b className="text-ink">Price: </b>
                {c.price}
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                <b className="text-ink">Best at: </b>
                {c.bestAt}
              </p>
            </div>
            <div className="rounded-[22px] border-2 border-ink bg-white p-6">
              <div className="label-mono text-zinc-500">[ Budgeto ]</div>
              <p className="mt-3 text-[16px]">Reads the PDF statement your bank already gives you and lists every recurring charge and fee in seconds, with cancel steps. No bank login.</p>
              <p className="mt-4 text-sm text-zinc-600">
                <b className="text-ink">Price: </b>
                Free first scan. Plans show up once your first leak report is ready.
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                <b className="text-ink">Best at: </b>
                Finding forgotten subscriptions and hidden fees fast.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="mt-8 overflow-hidden rounded-[22px] border border-black/[0.08] bg-white">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-black/[0.06] bg-zinc-50 px-4 py-3 text-[13px] font-semibold sm:px-6">
              <span />
              <span className="text-zinc-500">{c.name}</span>
              <span>Budgeto</span>
            </div>
            {c.rows.map(([q, them, us]) => (
              <div key={q} className="grid grid-cols-[1.1fr_1fr_1fr] items-start gap-2 border-b border-black/[0.05] px-4 py-4 text-[14px] last:border-0 sm:px-6 sm:text-[15px]">
                <span className="font-medium">{q}</span>
                <span className="text-zinc-600">{them}</span>
                <span className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" strokeWidth={3} />
                  {us}
                </span>
              </div>
            ))}
          </Reveal>
          <p className="mt-4 text-xs text-zinc-500">Facts as published by each company in November 2026. Prices change: check {c.name}&apos;s site for the latest.</p>

          <div className="mt-14 space-y-6">
            {faq.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-semibold">{f.q}</h3>
                <p className="mt-1.5 text-zinc-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center sm:py-28">
        <Reveal className="mx-auto max-w-[680px] px-5">
          <h2 className="title-xl text-[36px] sm:text-[52px]">
            See it on <span className="grad-text">your statement.</span>
          </h2>
          <div className="mt-9 flex justify-center">
            <CTA />
          </div>
          <p className="mt-10 text-sm text-white/50">
            Other comparisons:{" "}
            {COMPETITORS.filter((x) => x.slug !== c.slug).map((x, i) => (
              <span key={x.slug}>
                {i > 0 && " · "}
                <Link href={`/vs/${x.slug}`} className="underline-offset-4 hover:text-white hover:underline">
                  Budgeto vs {x.name}
                </Link>
              </span>
            ))}
          </p>
        </Reveal>
      </section>
    </MarketingShell>
  );
}
