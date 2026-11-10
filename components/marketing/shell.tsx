import Script from "next/script";
import { TopBar, Footer } from "@/components/landing/chrome";
import { StickyCTA } from "@/components/landing/bits";

/** Public marketing pages: same chrome as the landing page, Kwop visit tracking, the sticky main button on phones. */
export function MarketingShell({ children, sticky = true }: { children: React.ReactNode; sticky?: boolean }) {
  return (
    <main className="bg-night text-white">
      <TopBar />
      {children}
      <Footer />
      {sticky && <StickyCTA always />}
      <Script src="https://kwop.io/flow.js" data-site="s_5cdc0c337f" strategy="afterInteractive" />
    </main>
  );
}

export function Hero({ label, h1, h1b, intro, children }: { label: string; h1: string; h1b: string; intro: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
      <div className="dot-grid pointer-events-none absolute inset-0" />
      <div className="top-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[860px] px-5 text-center sm:px-8">
        <span className="label-mono text-white/60">[ {label} ]</span>
        <h1 className="title-xl mt-5 text-[40px] sm:text-[64px]">
          {h1}
          <br />
          <span className="grad-text">{h1b}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-relaxed text-white/65 sm:text-[19px]">{intro}</p>
        {children}
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
