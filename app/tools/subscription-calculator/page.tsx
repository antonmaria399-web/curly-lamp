import type { Metadata } from "next";
import { MarketingShell, Hero, JsonLd } from "@/components/marketing/shell";
import { Calculator } from "./calculator";

const title = "Subscription cost calculator: what your subscriptions cost a year";
const description = "Free calculator: tick the subscriptions you pay for, see what they cost a month, a year and in 5 years. No account, no bank login.";

export const metadata: Metadata = { title, description, alternates: { canonical: "/tools/subscription-calculator" }, openGraph: { title, description, url: "/tools/subscription-calculator" } };

export default function Page() {
  return (
    <MarketingShell>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "Subscription cost calculator", applicationCategory: "FinanceApplication", operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
      <Hero label="Free tool" h1="What do your subscriptions" h1b="really cost you?" intro="Tick what you pay for and edit the prices to yours. The total updates live. No account needed." />
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-[920px] px-4 sm:px-8">
          <Calculator />
        </div>
      </section>
    </MarketingShell>
  );
}
