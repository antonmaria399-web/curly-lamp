import type { Metadata } from "next";
import { CalendarCheck, FileText, Link2, Send } from "lucide-react";
import { MarketingShell, Hero, JsonLd } from "@/components/marketing/shell";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { FAQ } from "@/components/landing/bits";
import { EXAMPLE_SCRIPTS } from "@/lib/growth-content";
import { creatorCap, creatorRate } from "@/lib/growth";
import { ApplyForm } from "./apply-form";

const title = "Get paid to post about Budgeto";
const description = "A side income from short videos. No big audience needed. Paid every Monday per 1,000 views.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/creators" }, openGraph: { title, description, url: "/creators" } };

export default function CreatorsPage() {
  const rate = creatorRate();
  const cap = creatorCap();
  const faq = [
    { q: "Do I need a lot of followers?", a: "No. A new account about money or saving works. Views are what count, not followers." },
    { q: "How much do I get paid?", a: `$${rate} per 1,000 views, up to $${cap} per video, plus a share of the sales you bring with your own link. Paid every Monday.` },
    { q: "What do I post?", a: "Short videos where Budgeto is one natural step of a money routine: the 5-second money audit, the no-spend reset. You get the scripts and the hooks." },
    { q: "Do I have to show my own bank statement?", a: "No. You can use the sample statement inside Budgeto, or blur anything private. Never show account numbers." },
    { q: "How do views get counted?", a: "You send your video links and their view counts every Sunday. We check them on the platform and pay on Monday." },
  ];
  const steps: [typeof Send, string, string][] = [
    [Send, "Apply", "Tell us your handle and your average views."],
    [FileText, "Get your scripts + link", "Proven formats, 10 hooks each, and your own tracked link."],
    [Link2, "Post", "1 to 3 short videos a day. Under 200 views after 2 hours? New hook."],
    [CalendarCheck, "Get paid every Monday", `$${rate} per 1,000 views, up to $${cap} a video, plus a share of your sales.`],
  ];
  return (
    <MarketingShell sticky={false}>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <Hero label="Creators" h1="Get paid to post" h1b="about Budgeto." intro="A side income from short videos. No big audience needed: a new account about money works.">
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2">
          <span className="num rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">${rate} / 1,000 views</span>
          <span className="num rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">up to ${cap} / video</span>
          <span className="num rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">paid every Monday</span>
        </div>
        <div className="mt-8">
          <a href="#apply" className="btn-main inline-flex h-14 items-center rounded-full bg-lime px-8 text-[17px] font-semibold text-ink">
            Apply in 1 minute
          </a>
        </div>
      </Hero>

      <section className="bg-paper py-20 text-ink sm:py-28">
        <div className="mx-auto max-w-[1040px] px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="label-mono text-zinc-500">[ How it works ]</span>
            <h2 className="title-xl mt-4 text-[34px] sm:text-[48px]">Four steps.</h2>
          </Reveal>
          <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {steps.map(([Icon, t, d], i) => (
              <StaggerItem key={t} className="rounded-[20px] border border-black/[0.08] bg-white p-5">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5" />
                  <span className="num text-sm text-zinc-400">0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-zinc-600">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-20">
            <span className="label-mono text-zinc-500">[ Two example scripts ]</span>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {EXAMPLE_SCRIPTS.map((s) => (
                <div key={s.title} className="rounded-[20px] border border-black/[0.08] bg-white p-5">
                  <h3 className="font-semibold">{s.title}</h3>
                  <ol className="mt-3 space-y-2 text-[15px] text-zinc-700">
                    {s.lines.map((l, i) => (
                      <li key={l} className="flex gap-3">
                        <span className="num w-5 shrink-0 text-zinc-400">{i + 1}</span>
                        {l}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1040px] gap-12 px-5 sm:px-8 md:grid-cols-2">
          <Reveal>
            <span className="label-mono text-white/50">[ Apply ]</span>
            <h2 className="title-xl mt-4 text-[34px] sm:text-[48px]">Start this week.</h2>
            <p className="mt-4 max-w-sm text-white/60">We answer every application by email. Accepted creators get their scripts and their link right away.</p>
            <div className="mt-10 [--line:rgba(255,255,255,.1)] [--muted:rgba(255,255,255,.6)]">
              <FAQ items={faq} />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ApplyForm />
          </Reveal>
        </div>
      </section>
    </MarketingShell>
  );
}
