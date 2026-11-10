import "server-only";
import { getPlans } from "@/lib/kwop";
import { SITE_URL, abs, page } from "./site";

type Json = Record<string, unknown>;

/** Renders one JSON-LD block. `<` is escaped so no string can close the script tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const ORG_ID = SITE_URL + "/#organization";

export function organization(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Budgeto",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: SITE_URL + "/icons/512", width: 512, height: 512 },
    slogan: "Stop wondering where your paycheck went.",
  };
}

export function website(): Json {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": SITE_URL + "/#website", name: "Budgeto", url: SITE_URL, publisher: { "@id": ORG_ID }, inLanguage: "en-US" };
}

/**
 * SoftwareApplication with the REAL prices, read live from Kwop (GET KWOP_API), never hardcoded.
 * `withPrices` only where the page shows those prices (Google: mark up only what readers can see).
 * Elsewhere the only offer is the free scan, which every page shows ("Free to try").
 */
export async function softwareApp(opts: { withPrices: boolean; path?: string }): Promise<Json> {
  const where = abs(opts.path ?? "/");
  const free = { "@type": "Offer", name: "Free scan", price: "0", priceCurrency: "USD", url: SITE_URL + "/#scan" };
  let offers: Json[] = [free];
  if (opts.withPrices) {
    const { plans } = await getPlans();
    for (const p of plans) {
      offers.push({
        "@type": "Offer",
        name: `${p.name} (monthly)`,
        price: (p.price_cents / 100).toFixed(2),
        priceCurrency: (p.currency || "usd").toUpperCase(),
        priceSpecification: { "@type": "UnitPriceSpecification", price: (p.price_cents / 100).toFixed(2), priceCurrency: (p.currency || "usd").toUpperCase(), unitCode: "MON", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" } },
        url: where,
      });
      if (p.yearly)
        offers.push({
          "@type": "Offer",
          name: `${p.name} (yearly)`,
          price: (p.yearly.price_cents / 100).toFixed(2),
          priceCurrency: (p.currency || "usd").toUpperCase(),
          priceSpecification: { "@type": "UnitPriceSpecification", price: (p.yearly.price_cents / 100).toFixed(2), priceCurrency: (p.currency || "usd").toUpperCase(), unitCode: "ANN", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "ANN" } },
          url: where,
        });
    }
    if (offers.length === 1) offers = [free];
  }
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": SITE_URL + "/#app",
    name: "Budgeto",
    url: SITE_URL,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web (any phone or computer browser)",
    description: "Upload a bank statement PDF; Budgeto flags forgotten subscriptions, recurring charges and bank fees in seconds, with no bank login.",
    publisher: { "@id": ORG_ID },
    offers,
  };
}

export function faqPage(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Breadcrumb for a page path: Home › (Guides ›) Page. Matches the visible breadcrumb. */
export function crumbs(path: string): { name: string; path: string }[] {
  const list = [{ name: "Home", path: "/" }];
  if (path.startsWith("/guides/")) list.push({ name: "Guides", path: "/guides" });
  list.push({ name: page(path).name, path });
  return list;
}

export function breadcrumbList(path: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs(path).map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function article(path: string): Json {
  const p = page(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title.replace(/ · Budgeto$/, ""),
    description: p.description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    image: SITE_URL + "/og/" + path.slice(1).replace(/\//g, "--"),
    datePublished: p.updated,
    dateModified: p.updated,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}
