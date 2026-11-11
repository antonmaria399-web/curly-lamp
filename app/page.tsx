import { existsSync } from "node:fs";
import path from "node:path";
import { KwopFlow } from "@/components/kwop-flow";
import { Check, EyeOff, FileText, Lock, ShieldCheck, Trash2, X } from "lucide-react";
import { TopBar, Footer } from "@/components/landing/chrome";
import { HeroFunnel } from "@/components/landing/hero-funnel";
import { VSL } from "@/components/landing/vsl";
import { CTA, FAQ, FeatureLoop, HeroNotifications, HowPhone, StickyCTA } from "@/components/landing/bits";
import { Phone } from "@/components/landing/phone";
import { Reveal, Stagger, StaggerItem, CountUp } from "@/components/ui/reveal";
import type { Metadata } from "next";
import { getViewer } from "@/lib/viewer";
import { canonical } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Budgeto — Find the subscriptions you forgot you pay" },
  description:
    "Drop your bank statement PDF. Budgeto's AI flags forgotten subscriptions and hidden fees in seconds. No bank login, no manual entry. Free to try.",
  alternates: { canonical: canonical("/") },
  openGraph: { url: canonical("/") },
};

const QUESTIONS = [
  {
    q: "Do I have to give Budgeto my bank login?",
    a: "No. You upload the PDF statement you can already download from your bank's website or app. Budgeto never asks for your bank password and never connects to your account.",
  },
  {
    q: "Is my statement safe?",
    a: "Your file is sent over an encrypted connection, read once by our AI to list the transactions, and then thrown away. We never store the PDF itself, only your leak report, which you can delete anytime from your account.",
  },
  {
    q: "Which banks does it work with?",
    a: "Any US bank or card that gives you a PDF statement: Chase, Bank of America, Wells Fargo, Capital One, Citi, Amex, Discover, credit unions and more. A clear photo of a paper statement works too.",
  },
  {
    q: "Can Budgeto see which apps I actually use?",
    a: "No, and nothing on the web can. Budgeto flags every recurring charge and fee, then you tap “I still use it” or “I cancelled it”. Your savings tracker counts the money you freed up.",
  },
  {
    q: "Does Budgeto cancel subscriptions for me?",
    a: "It gives you the exact steps for each one (where to click, or who to call) so you cancel it yourself in a minute. No one gets access to your accounts.",
  },
  {
    q: "How much does it cost?",
    a: "You try it free first. The plans show up once your first leak report is ready, and every plan has a 7-day money-back guarantee.",
  },
];

export default async function Home() {
  const viewer = await getViewer();
  const hasVideo = existsSync(path.join(process.cwd(), "public", "vsl.mp4"));

  return (
    <main className="bg-night text-white">
      <TopBar />

      {/* HERO: the product itself */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1120px] px-4 sm:px-8">
          <div className="mx-auto max-w-[820px] text-center">
            <Reveal>
              <span className="label-mono text-white/60">[ AI statement scan ]</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="title-xl mt-5 text-[42px] sm:text-[72px]">
                Find the subscriptions you forgot you pay.
                <br />
                <span className="grad-text">In 5 seconds.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-white/65 sm:text-[19px]">
                Drop your bank statement PDF. Budgeto&apos;s AI flags <b className="font-semibold text-white">recurring charges</b> and{" "}
                <b className="font-semibold text-white">hidden fees</b>. No bank login.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.18} className="mx-auto mt-10 max-w-[760px]">
            <div id="scan" className="scroll-mt-28 rounded-[26px]">
              <HeroFunnel authed={Boolean(viewer.user)} paid={viewer.plan.paid} />
            </div>
            <p className="num mt-5 text-center text-[12px] uppercase tracking-[0.14em] text-white/45">Free to try · No bank login · No card · Ready in seconds</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[13px] text-white/45">
              <Lock className="h-3.5 w-3.5" /> Your file is read once and never stored. Delete your report anytime.
            </p>
          </Reveal>
        </div>
      </section>

      {/* VSL */}
      <section className="relative pb-24 sm:pb-32" aria-label="Watch how it works">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-8">
          <Reveal>
            <VSL video={hasVideo} />
          </Reveal>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="bg-paper py-24 text-ink sm:py-32">
        <div className="mx-auto grid max-w-[1120px] items-center gap-12 px-5 sm:px-8 md:grid-cols-2">
          <Reveal>
            <span className="label-mono text-zinc-500">[ The problem ]</span>
            <h2 className="title-xl mt-4 text-[38px] sm:text-[56px]">
              Your statement is 6 pages of codes.
              <br />
              <span className="grad-text-ink">Leaks love that.</span>
            </h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-zinc-600">
              “ADOBE *CREATIVE CLD”, “APPLE.COM/BILL”, a storage unit you emptied last spring. Each one is small. Together they add up month after month,
              and budgeting apps want hours of setup before they show you anything.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[22px] border border-black/10 bg-white p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,.25)]">
              <div className="mb-3 flex items-center justify-between text-xs font-medium text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> statement_sep.pdf · page 2 of 6
                </span>
                <span className="label-mono">[ Example ]</span>
              </div>
              {[
                ["09/02", "NETFLIX.COM 866-579-7172 CA", "15.49", true],
                ["09/04", "KROGER #412 COLUMBUS OH", "96.32", false],
                ["09/05", "CRUNCH FITNESS MEMBERSHIP", "29.99", true],
                ["09/07", "SHELL OIL 57444 COLUMBUS", "32.20", false],
                ["09/08", "ADOBE *CREATIVE CLD SAN JOSE", "22.99", true],
                ["09/11", "SMARTSAFE SELF STORAGE 114", "44.00", true],
                ["09/19", "STARBUCKS STORE 10233", "6.45", false],
                ["09/30", "MONTHLY SERVICE FEE", "12.00", true],
              ].map(([d, t, a, leak]) => (
                <div key={t as string} className={`num flex items-center gap-3 rounded-lg px-2 py-2 text-[12px] sm:text-[13px] ${leak ? "bg-[#e11d48]/[0.06]" : ""}`}>
                  <span className="text-zinc-400">{d}</span>
                  <span className="flex-1 truncate">{t}</span>
                  <span className={leak ? "font-semibold text-[#e11d48]" : ""}>−{a}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
        <div className="top-glow pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="label-mono text-white/50">[ How it works ]</span>
            <h2 className="title-xl mt-4 text-[38px] sm:text-[56px]">
              Three steps. <span className="grad-text">Zero typing.</span>
            </h2>
          </Reveal>
          <Stagger className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8">
            {[
              [1, "Upload", "Drop last month's statement PDF from your bank's website. Or snap a photo."],
              [2, "Analyze", "The AI reads every line, groups charges by merchant and flags what repeats."],
              [3, "Save", "Cancel what you don't use with the steps we give you. Watch your savings stack up."],
            ].map(([n, t, d]) => (
              <StaggerItem key={n as number} className="text-center">
                <HowPhone step={n as 1 | 2 | 3} />
                <div className="num mt-8 text-sm text-lime">0{n as number}</div>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight">{t as string}</h3>
                <p className="mx-auto mt-2 max-w-[300px] text-white/60">{d as string}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-16 flex justify-center">
            <CTA />
          </div>
        </div>
      </section>

      {/* FEATURES IN ACTION */}
      <section id="features" className="scroll-mt-24 bg-paper py-24 text-ink sm:py-32">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <span className="label-mono text-zinc-500">[ What Budgeto does ]</span>
            <h2 className="title-xl mt-4 text-[38px] sm:text-[56px]">
              One PDF in.
              <br />
              <span className="grad-text-ink">Every leak out.</span>
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
            {(
              [
                ["scan", "PDF Statement Scan", "Drag and drop your bank export. Transactions are read and sorted automatically. No typing, no bank link."],
                ["fees", "Hidden Fee Hunter", "Overdraft, ATM and “monthly service” fees, flagged with a script to get them waived."],
                ["goal", "Savings Goal Tracker", "Set a monthly target. Every charge you cancel stacks up toward it."],
                ["export", "Faceless Export", "Clean stat screens of your results, sized for TikTok, Reels and Shorts. No name, no account numbers."],
              ] as const
            ).map(([k, t, d]) => (
              <StaggerItem key={k} className="overflow-hidden rounded-[22px] border border-black/[0.08] bg-white">
                <div className="h-[230px] bg-zinc-50 p-5 [--surface:#fff] [--line:rgba(10,11,10,.08)] [--muted:#71717a]">
                  <FeatureLoop kind={k} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold tracking-tight">{t}</h3>
                  <p className="mt-1.5 text-zinc-600">{d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-sm text-zinc-500">
            Honest note: no app can see which subscriptions you still open. Budgeto flags every recurring charge, and you decide what goes.
          </p>
        </div>
      </section>

      {/* IN ACTION: phone + notifications */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-[1120px] items-center gap-14 px-5 sm:px-8 md:grid-cols-2">
          <Reveal>
            <span className="label-mono text-white/50">[ After your first scan ]</span>
            <h2 className="title-xl mt-4 text-[38px] sm:text-[56px]">
              It keeps watching
              <br />
              <span className="grad-text">so you don&apos;t have to.</span>
            </h2>
            <p className="mt-5 max-w-md text-[17px] text-white/60">
              Scan next month&apos;s statement and Budgeto compares: new subscriptions, price hikes, fees that came back. Your savings tracker keeps the score.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Phone lock>
              <HeroNotifications />
            </Phone>
          </Reveal>
        </div>
      </section>

      {/* THE USUAL WAY vs BUDGETO */}
      <section className="bg-paper py-24 text-ink sm:py-32">
        <div className="mx-auto max-w-[920px] px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="label-mono text-zinc-500">[ The usual way vs Budgeto ]</span>
            <h2 className="title-xl mt-4 text-[38px] sm:text-[52px]">A weekend of setup, or 5 seconds.</h2>
          </Reveal>
          <Reveal delay={0.08} className="mt-12 overflow-hidden rounded-[22px] border border-black/[0.08] bg-white">
            <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-black/[0.06] bg-zinc-50 px-4 py-3 text-[13px] font-semibold sm:px-6">
              <span />
              <span className="text-zinc-500">Budgeting apps</span>
              <span>Budgeto</span>
            </div>
            {[
              ["Bank password needed", "Yes, linked via a third party", "Never. Just a PDF"],
              ["Time to first insight", "Days of syncing", "Seconds"],
              ["Manual entry", "Categories, rules, budgets", "None"],
              ["Finds forgotten subscriptions", "If you go looking", "On the first screen"],
              ["Bank fees flagged", "Rarely", "With a waive script"],
            ].map(([a, b, c]) => (
              <div key={a} className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-2 border-b border-black/[0.05] px-4 py-4 text-[14px] last:border-0 sm:px-6 sm:text-[15px]">
                <span className="font-medium">{a}</span>
                <span className="flex items-start gap-1.5 text-zinc-500">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" />
                  {b}
                </span>
                <span className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" strokeWidth={3} />
                  {c}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WHAT CHANGES: true product facts */}
      <section id="privacy" className="scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <span className="label-mono text-white/50">[ What changes ]</span>
            <h2 className="title-xl mt-4 text-[38px] sm:text-[56px]">
              Less guessing.
              <br />
              <span className="grad-text">More paycheck left.</span>
            </h2>
          </Reveal>
          <Stagger className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-white/10 bg-white/10 md:grid-cols-4">
            {[
              [0, "bank logins", "", ""],
              [1, "PDF is all it takes", "", ""],
              [45, "subscription services recognized, with cancel steps", "", "+"],
              [5, "seconds to your first leak report", "~", ""],
            ].map(([v, l, pre, suf]) => (
              <StaggerItem key={l as string} className="bg-night p-6 sm:p-8">
                <CountUp value={v as number} prefix={pre as string} suffix={suf as string} className="num text-[44px] font-semibold tracking-tight text-lime sm:text-[56px]" />
                <p className="mt-2 text-sm text-white/60">{l as string}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Stagger className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              [EyeOff, "Read once, never stored", "Your PDF is read by the AI and discarded. Only the leak report is saved."],
              [Trash2, "Delete anytime", "Delete a report, or your whole account and its data, in two taps."],
              [ShieldCheck, "No bank access", "We can't move money or see your accounts. We only see the file you choose."],
            ].map(([I, t, d]) => {
              const Icon = I as typeof EyeOff;
              return (
                <StaggerItem key={t as string} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-6">
                  <Icon className="h-5 w-5 text-lime" />
                  <h3 className="mt-4 font-semibold">{t as string}</h3>
                  <p className="mt-1 text-sm text-white/60">{d as string}</p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* QUESTIONS */}
      <section id="faq" className="scroll-mt-24 bg-paper py-24 text-ink sm:py-32 [--line:rgba(10,11,10,.1)] [--muted:#52525b]">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <Reveal className="text-center">
            <span className="label-mono text-zinc-500">[ Questions ]</span>
            <h2 className="title-xl mt-4 text-[38px] sm:text-[52px]">Before you upload.</h2>
          </Reveal>
          <Reveal delay={0.06} className="mt-12">
            <FAQ items={QUESTIONS} />
          </Reveal>
        </div>
      </section>

      {/* FINAL */}
      <section className="relative overflow-hidden py-28 text-center sm:py-36">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <Reveal className="relative mx-auto max-w-[760px] px-5">
          <h2 className="title-xl text-[42px] sm:text-[72px]">
            Tonight, find out
            <br />
            <span className="grad-text">where your paycheck goes.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/60">Grab last month&apos;s PDF. Five seconds later, you know what to cancel.</p>
          <div className="mt-10 flex justify-center">
            <CTA />
          </div>
        </Reveal>
      </section>

      <Footer />
      <StickyCTA />
      <KwopFlow />
    </main>
  );
}
