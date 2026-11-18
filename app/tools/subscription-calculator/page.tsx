import type { Metadata } from "next";
import { PublicPage, appLd, faqLd } from "@/components/landing/public-page";
import { CTA, FAQ } from "@/components/landing/bits";
import { LeakCalculator } from "@/components/landing/calculator";
import { Reveal } from "@/components/ui/reveal";
import { canonical } from "@/lib/seo";

const url = canonical("/tools/subscription-calculator");
const title = "Subscription cost calculator: what do your subscriptions cost a year?";
const description = "Free tool: tap the subscriptions you pay for (Netflix, Spotify, Prime, gym…) and see your monthly and yearly total. No sign-up.";

export const metadata: Metadata = { title, description, alternates: { canonical: url }, openGraph: { url, title, description } };

const FAQS = [
  { q: "Are these prices exact?", a: "They're usual US list prices before tax, for the most common plan. Tap any amount to type what you really pay." },
  { q: "Is anything saved?", a: "No. This calculator runs in your browser and saves nothing." },
  { q: "How do I find the ones I forgot?", a: "Your bank statement knows. Drop its PDF into Budgeto and every recurring charge and bank fee is listed in about 5 seconds, free to try." },
];

export default function CalculatorPage() {
  return (
    <PublicPage jsonLd={[appLd(url), faqLd(FAQS)]}>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1040px] px-4 sm:px-8">
          <div className="mx-auto max-w-[760px] text-center">
            <Reveal>
              <span className="label-mono text-white/60">[ Free tool ]</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="title-xl mt-5 text-[40px] sm:text-[68px]">
                What do your subscriptions
                <br />
                <span className="grad-text">cost a year?</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-5 max-w-[540px] text-[17px] text-white/65">Tap what you pay for. The total counts up as you go. No sign-up, nothing saved.</p>
            </Reveal>
          </div>
          <Reveal delay={0.18} className="mt-12 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 sm:p-7">
            <LeakCalculator dark />
          </Reveal>
        </div>
      </section>

      <section className="py-20 text-center sm:py-24">
        <Reveal className="mx-auto max-w-[680px] px-5">
          <h2 className="title-xl text-[34px] sm:text-[52px]">
            That&apos;s the ones you remember.
            <br />
            <span className="grad-text">Find the rest.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-white/60">Drop your bank statement PDF: Budgeto lists every renewal, forgotten trial and bank fee in about 5 seconds.</p>
          <div className="mt-9 flex justify-center">
            <CTA />
          </div>
        </Reveal>
      </section>

      <section className="bg-paper py-20 text-ink sm:py-24 [--line:rgba(10,11,10,.1)] [--muted:#52525b]">
        <div className="mx-auto max-w-[760px] px-5 sm:px-8">
          <FAQ items={FAQS} />
        </div>
      </section>
    </PublicPage>
  );
}
