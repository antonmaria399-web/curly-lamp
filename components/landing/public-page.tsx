import { KwopFlow } from "@/components/kwop-flow";
import { Footer, TopBar } from "./chrome";
import { StickyCTA } from "./bits";

/** Shell for the public growth pages (/for, /vs, /tools, /creators): same top bar, footer and sticky main button. */
export function PublicPage({ children, jsonLd }: { children: React.ReactNode; jsonLd?: object[] }) {
  return (
    <main className="bg-night text-white">
      {jsonLd?.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j).replace(/</g, "\\u003c") }} />
      ))}
      <TopBar />
      {children}
      <Footer />
      <StickyCTA />
      <KwopFlow />
    </main>
  );
}

export const faqLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const appLd = (url: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Budgeto",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web, iOS, Android (browser)",
  url,
  description: "Drop your bank statement PDF. Budgeto's AI flags forgotten subscriptions and hidden fees in seconds. No bank login.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free to try" },
});
