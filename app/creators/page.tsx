import type { Metadata } from "next";
import { PublicPage, faqLd } from "@/components/landing/public-page";
import { FAQ } from "@/components/landing/bits";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { CreatorForm } from "@/components/growth/creator-form";
import { SCRIPTS_EXAMPLE } from "@/lib/growth-content";
import { canonical } from "@/lib/seo";

export const dynamic = "force-dynamic";

const url = canonical("/creators");
export const metadata: Metadata = {
  title: "Creators: get paid to post about Budgeto",
  description: "A side income, no big audience needed. Post short videos about finding forgotten subscriptions with Budgeto and get paid every Monday per 1,000 views.",
  alternates: { canonical: url },
  openGraph: { url },
};

export default function CreatorsPage() {
  const rate = Math.max(0, Number(process.env.CREATOR_RATE) || 1);
  const cap = Math.max(0, Number(process.env.CREATOR_CAP) || 100);
  const money = (n: number) => "$" + (Number.isInteger(n) ? n : n.toFixed(2));
  const faq = [
    { q: "Do I need a lot of followers?", a: "No. A new account about money, saving or budgeting works. Views are what count, not followers." },
    { q: "How much do I get paid?", a: `${money(rate)} per 1,000 views, up to ${money(cap)} per video, paid every Monday. Plus a share of the sales your own link brings.` },
    { q: "What do I post?", a: "Short videos on 2 proven formats, with scripts we give you: a subscription audit and a payday reset. You show the app as one step, with your real numbers or the sample statement." },
    { q: "Do I have to show my bank statement?", a: "Never. You can use Budgeto's sample statement and say it's a sample. Never show account numbers." },
    { q: "How do views get counted?", a: "Every Sunday you send your video links and their views. We check them on the video and pay on Monday." },
  ];
  return (
    <PublicPage jsonLd={[faqLd(faq)]}>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[860px] px-5 text-center sm:px-8">
          <Reveal>
            <span className="label-mono text-white/60">[ Creator program ]</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="title-xl mt-5 text-[42px] sm:text-[72px]">
              Get paid to post
              <br />
              <span className="grad-text">about Budgeto.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] text-white/65 sm:text-[19px]">
              A side income, <b className="font-semibold text-white">no big audience needed</b>. Post short videos with our scripts and get{" "}
              <b className="font-semibold text-white">
                {money(rate)} per 1,000 views
              </b>
              , every Monday.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="num mt-6 text-[12px] uppercase tracking-[0.14em] text-white/45">
              {money(rate)} / 1,000 views · up to {money(cap)} per video · paid Mondays · + a share of your sales
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal>
            <span className="label-mono text-white/50">[ How it works ]</span>
          </Reveal>
          <Stagger className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Apply", "Two minutes, below. Tell us where you post."],
              ["02", "Get your kit", "Your scripts, your hooks and your own link."],
              ["03", "Post", "1 to 3 short videos a day, on the same script, new hooks."],
              ["04", "Get paid", `Every Monday, ${money(rate)} per 1,000 views, up to ${money(cap)} a video.`],
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

      <section className="bg-paper py-24 text-ink">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal>
            <span className="label-mono text-zinc-500">[ 2 example scripts ]</span>
            <h2 className="title-xl mt-4 text-[34px] sm:text-[48px]">You never start from a blank page.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {SCRIPTS_EXAMPLE.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06} className="rounded-[22px] border border-black/[0.08] bg-white p-6">
                <h3 className="font-semibold">{s.title}</h3>
                <ol className="mt-4 space-y-2.5">
                  {s.lines.map((l, j) => (
                    <li key={j} className="flex gap-3 text-[15px] text-zinc-700">
                      <span className="num mt-0.5 text-xs text-zinc-400">{String(j + 1).padStart(2, "0")}</span>
                      {l}
                    </li>
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 py-24">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-5 sm:px-8 md:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <span className="label-mono text-white/50">[ Apply ]</span>
            <h2 className="title-xl mt-4 text-[34px] sm:text-[48px]">
              Two minutes.
              <br />
              <span className="grad-text">Then post.</span>
            </h2>
            <p className="mt-4 max-w-sm text-white/60">We answer every application by email. Your details are only read by the Budgeto team.</p>
          </Reveal>
          <Reveal delay={0.08} className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <CreatorForm />
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-24 text-ink [--line:rgba(10,11,10,.1)] [--muted:#52525b]">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="label-mono text-zinc-500">[ Questions ]</span>
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <FAQ items={faq} />
          </Reveal>
        </div>
      </section>
    </PublicPage>
  );
}
