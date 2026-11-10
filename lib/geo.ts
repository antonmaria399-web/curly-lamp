import "server-only";
import { getPlans, type KwopPlan } from "@/lib/kwop";
import { LIMITS } from "@/lib/quotas";
import { DISAMBIGUATION, FEATURES, NAME, ONE_LINER, PROFILES, SHORT, SITE_URL } from "@/lib/identity";

export type QA = { q: string; a: string };

const money = (cents: number) => "$" + (cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2));
const short = (p: KwopPlan) => p.name.replace(/^Budgeto\s+/i, "");

/** Prices come live from Kwop (never hardcoded). Empty list if Kwop is unreachable. */
export async function getPricing() {
  const { plans } = await getPlans();
  return plans.filter((p) => p.price_cents > 0);
}

export function priceLine(plans: KwopPlan[]) {
  return plans
    .map((p) => `${short(p)} ${money(p.price_cents)}/${p.interval}${p.yearly ? ` (${money(p.yearly.price_cents)}/year)` : ""}`)
    .join(", ")
    .replace(/, ([^,]*)$/, " and $1");
}

/** The 5 GEO questions, each answer starting with the answer. */
export function geoFaq(plans: KwopPlan[]): QA[] {
  const cheapest = plans[0];
  return [
    { q: "What is Budgeto?", a: SHORT },
    {
      q: "Who is it for?",
      a: "Budgeto is for people in the United States who want to save more money and suspect subscriptions or bank fees are eating their paycheck, especially if they don't want to give a budgeting app their bank login or spend a weekend setting one up.",
    },
    {
      q: "How much does it cost?",
      a: plans.length
        ? `Budgeto is free to try, then ${priceLine(plans)}. Yearly plans cost less per month, and you can cancel anytime.`
        : "Budgeto is free to try; the paid plans are monthly or yearly and you can cancel anytime.",
    },
    {
      q: "Is there a free version?",
      a: `Yes: you can scan up to ${LIMITS[0].scans} statements a day for free, with no account and no card. The free leak report shows your first leak in full; the total, the other leaks and the fee list unlock with a paid plan.`,
    },
    {
      q: "Budgeto vs YNAB: which one should I use?",
      a: `Use Budgeto to find the money you are losing, and YNAB to plan the money you have. YNAB is a zero-based budgeting app (about $14.99/month or $109/year) where you link your bank or enter accounts and give every dollar a job. Budgeto needs no bank login and no setup: upload a statement PDF and see your forgotten subscriptions and fees in seconds${cheapest ? `, from ${money(cheapest.price_cents)}/${cheapest.interval}` : ""}. Many people run Budgeto once a month and keep budgeting elsewhere.`,
    },
  ];
}

/** The identical Organization + SoftwareApplication @graph for / and /about. */
export function identityGraph(plans: KwopPlan[]) {
  const org = `${SITE_URL}/#organization`;
  const offers = [
    { "@type": "Offer", name: "Free try", price: "0", priceCurrency: "USD", description: `${LIMITS[0].scans} statement scans a day, first leak shown in full.` },
    ...plans.flatMap((p) => {
      const cur = p.currency.toUpperCase();
      const base = { "@type": "Offer", priceCurrency: cur, url: `${SITE_URL}/`, availability: "https://schema.org/InStock" };
      const out: object[] = [
        { ...base, name: `${p.name} (monthly)`, price: (p.price_cents / 100).toFixed(2), priceSpecification: { "@type": "UnitPriceSpecification", price: (p.price_cents / 100).toFixed(2), priceCurrency: cur, billingDuration: "P1M", unitText: "MONTH" } },
      ];
      if (p.yearly)
        out.push({ ...base, name: `${p.name} (yearly)`, price: (p.yearly.price_cents / 100).toFixed(2), priceSpecification: { "@type": "UnitPriceSpecification", price: (p.yearly.price_cents / 100).toFixed(2), priceCurrency: cur, billingDuration: "P1Y", unitText: "YEAR" } });
      return out;
    }),
  ];
  const sameAs = PROFILES.map((p) => p.url);
  return [
    {
      "@type": "Organization",
      "@id": org,
      name: NAME,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/512`, width: 512, height: 512 },
      description: ONE_LINER,
      disambiguatingDescription: DISAMBIGUATION,
      areaServed: { "@type": "Country", name: "United States" },
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: NAME,
      url: `${SITE_URL}/`,
      image: `${SITE_URL}/icons/512`,
      description: SHORT,
      disambiguatingDescription: DISAMBIGUATION,
      applicationCategory: "FinanceApplication",
      applicationSubCategory: "Subscription and bank fee finder",
      operatingSystem: "Web, iOS, Android (in the browser)",
      inLanguage: "en-US",
      audience: { "@type": "Audience", audienceType: "People in the United States who want to save more money", geographicArea: { "@type": "Country", name: "United States" } },
      featureList: FEATURES.map(([t]) => t),
      publisher: { "@id": org },
      offers,
    },
  ];
}

export function faqPage(url: string, items: QA[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** One <script type="application/ld+json"> payload: identity @graph + this page's WebPage + FAQPage. */
export function pageJsonLd(opts: { path: string; title: string; plans: KwopPlan[]; faq: QA[]; about?: boolean }) {
  const url = SITE_URL + (opts.path === "/" ? "/" : opts.path);
  const page = {
    "@type": opts.about ? "AboutPage" : "WebPage",
    "@id": url,
    url,
    name: opts.title,
    description: ONE_LINER,
    inLanguage: "en-US",
    about: { "@id": `${SITE_URL}/#app` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  return { "@context": "https://schema.org", "@graph": [...identityGraph(opts.plans), page, faqPage(url, opts.faq)] };
}

/** Safe inside <script>: no "</script>" break-out. */
export const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
