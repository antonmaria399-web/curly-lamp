import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText, Lock, Repeat } from "lucide-react";
import { PublicPage, appLd, faqLd } from "@/components/landing/public-page";
import { HeroFunnel } from "@/components/landing/hero-funnel";
import { CTA, FAQ } from "@/components/landing/bits";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { AUDIENCES } from "@/lib/pages-content";
import { canonical } from "@/lib/seo";
import { getViewer } from "@/lib/viewer";
import { usd } from "@/lib/cn";

export const dynamic = "force-dynamic";
export const dynamicParams = false;
export function generateStaticParams() {
  return AUDIENCES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/for/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = AUDIENCES.find((x) => x.slug === slug);
  if (!a) return {};
  const url = canonical(`/for/${a.slug}`);
  return { title: a.title, description: a.description, alternates: { canonical: url }, openGraph: { url, title: a.title, description: a.description } };
}

export default async function ForPage({ params }: PageProps<"/for/[slug]">) {
  const { slug } = await params;
  const a = AUDIENCES.find((x) => x.slug === slug);
  if (!a) notFound();
  const viewer = await getViewer();
  const total = a.example.leaks.reduce((s, l) => s + l.monthly, 0);
  const url = canonical(`/for/${a.slug}`);

  return (
    <PublicPage jsonLd={[appLd(url), faqLd(a.faq)]}>
      <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1120px] px-4 sm:px-8">
          <div className="mx-auto max-w-[820px] text-center">
            <Reveal>
              <span className="label-mono text-white/60">[ Budgeto for {a.label.toLowerCase()} ]</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="title-xl mt-5 text-[40px] sm:text-[68px]">
                {a.h1}
                <br />
                <span className="grad-text">{a.h1b}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-relaxed text-white/65 sm:text-[19px]">{a.sub}</p>
            </Reveal>
          </div>
          <Reveal delay={0.18} className="mx-auto mt-10 max-w-[760px]">
            <div id="scan" className="scroll-mt-28 rounded-[26px]">
              <HeroFunnel authed={Boolean(viewer.user)} paid={viewer.plan.paid} />
            </div>
            <p className="num mt-5 text-center text-[12px] uppercase tracking-[0.14em] text-white/45">Free to try · No bank login · No card · Ready in seconds</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[13px] text-white/45">
              <Lock className="h-3.5 w-3.5" /> Your file is read once and never stored.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-24 text-ink sm:py-28">
        <div className="mx-auto grid max-w-[1120px] items-start gap-12 px-5 sm:px-8 md:grid-cols-2">
          <div>
            <Reveal>
              <span className="label-mono text-zinc-500">[ Sound familiar? ]</span>
              <h2 className="title-xl mt-4 text-[34px] sm:text-[48px]">Where the money slips out.</h2>
            </Reveal>
            <Stagger className="mt-8 space-y-4">
              {a.pains.map((p) => (
                <StaggerItem key={p.t} className="rounded-[20px] border border-black/[0.08] bg-white p-5">
                  <h3 className="font-semibold">{p.t}</h3>
                  <p className="mt-1 text-zinc-600">{p.d}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal delay={0.1}>
            <div className="rounded-[22px] border border-black/10 bg-white p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.25)]">
              <div className="mb-4 flex items-center justify-between text-xs font-medium text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> {a.example.file}
                </span>
                <span className="label-mono">[ Example ]</span>
              </div>
              <div className="label-mono text-zinc-500">[ Leaking every month ]</div>
              <div className="num mt-1 text-[40px] font-semibold tracking-tight">{usd(total)}<span className="text-base font-normal text-zinc-400"> / mo</span></div>
              <ul className="mt-4 space-y-2">
                {a.example.leaks.map((l) => (
                  <li key={l.merchant} className="rounded-2xl border border-black/[0.07] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-lime ring-2 ring-lime/30" />
                      <span className="truncate font-medium">{l.merchant}</span>
                      <span className="ledger-leader" />
                      <span className="num font-semibold text-[#e11d48]">−{usd(l.monthly)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 pl-4 text-xs text-zinc-500">
                      <Repeat className="h-3 w-3" /> {l.note}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-zinc-500">Example values. Your report lists what&apos;s really on your statement.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-28">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="label-mono text-white/50">[ How it works ]</span>
            <h2 className="title-xl mt-4 text-[34px] sm:text-[48px]">
              One PDF. <span className="grad-text">Every leak.</span>
            </h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              ["01", "Download", "Get last month's statement PDF from your bank's website or app. Or take a photo."],
              ["02", "Drop it in", "Budgeto's AI reads every line and spots what repeats, in about 5 seconds."],
              ["03", "Cancel and keep", "Follow the steps for each leak, and watch your savings add up."],
            ].map(([n, t, d]) => (
              <StaggerItem key={n} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-6">
                <div className="num text-sm text-lime">{n}</div>
                <h3 className="mt-2 text-xl font-semibold">{t}</h3>
                <p className="mt-1.5 text-white/60">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-paper py-24 text-ink sm:py-28 [--line:rgba(10,11,10,.1)] [--muted:#52525b]">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="label-mono text-zinc-500">[ Questions ]</span>
            <h2 className="title-xl mt-4 text-[34px] sm:text-[48px]">Before you upload.</h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-10">
            <FAQ items={[...a.faq, { q: "How much does it cost?", a: "You try it free first. The plans show up once your first leak report is ready." }]} />
          </Reveal>
          <p className="mt-8 text-center text-sm text-zinc-500">
            Also made for{" "}
            {AUDIENCES.filter((x) => x.slug !== a.slug)
              .slice(0, 4)
              .map((x, i, arr) => (
                <span key={x.slug}>
                  <Link href={`/for/${x.slug}`} className="font-medium text-ink underline-offset-4 hover:underline">
                    {x.label.toLowerCase()}
                  </Link>
                  {i < arr.length - 1 ? ", " : "."}
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
            Tonight, find out
            <br />
            <span className="grad-text">what&apos;s billing you.</span>
          </h2>
          <div className="mt-10 flex justify-center">
            <CTA />
          </div>
        </Reveal>
      </section>
    </PublicPage>
  );
}
