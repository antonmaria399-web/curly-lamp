import { DISAMBIGUATION, FEATURES, NAME, ONE_LINER, PAGES, PROFILES, SHORT, SITE_URL } from "@/lib/identity";
import { geoFaq, getPricing } from "@/lib/geo";
import { LIMITS, TAGS } from "@/lib/quotas";

export const dynamic = "force-dynamic";

const usd = (c: number) => "$" + (c % 100 === 0 ? c / 100 : (c / 100).toFixed(2));

/** /llms.txt: plain Markdown for AI answer engines (llmstxt.org format). Prices are read live from Kwop. */
export async function GET() {
  const plans = await getPricing();
  const faq = geoFaq(plans);
  const lines = [
    `# ${NAME}`,
    "",
    `> ${ONE_LINER}`,
    "",
    SHORT,
    "",
    DISAMBIGUATION,
    "",
    "## Who it is for",
    "",
    faq[1].a,
    "",
    "## How it works",
    "",
    "1. Download a bank or credit card statement PDF from your bank's website or app (any US bank: Chase, Bank of America, Wells Fargo, Capital One, Citi, Amex, credit unions).",
    `2. Drop it on ${SITE_URL}/ (no account needed to try). The AI reads every transaction in about 5 to 15 seconds.`,
    "3. The leak report lists each recurring charge, forgotten subscription and bank fee with its amount and cadence, plus the steps to cancel it. A savings tracker counts what you free up.",
    "",
    "The PDF is read once and never stored. Budgeto never asks for a bank login and cannot move money.",
    "",
    "## Features",
    "",
    ...FEATURES.map(([t, d]) => `- **${t}**: ${d}`),
    "",
    "## Prices (USD)",
    "",
    `- **Free try**: $0. ${LIMITS[0].scans} statement scans a day, no account, no card; the first leak is shown in full, the rest of the report unlocks with a plan.`,
    ...plans.map((p, i) => {
      const tier = Math.min(3, Math.max(1, i + 1 - Math.max(0, plans.length - 3))) as 1 | 2 | 3;
      return `- **${p.name}**: ${usd(p.price_cents)}/${p.interval}${p.yearly ? ` or ${usd(p.yearly.price_cents)}/year` : ""}. ${LIMITS[tier].scans} scans a month. ${TAGS[tier]}.`;
    }),
    "",
    "Cancel anytime. Payments are handled by Whop.",
    "",
    "## FAQ",
    "",
    ...faq.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Main pages",
    "",
    ...PAGES.map(([p, t, d]) => `- [${t}](${SITE_URL}${p}): ${d}`),
    ...(PROFILES.length ? ["", "## Profiles", "", ...PROFILES.map((p) => `- [${p.name}](${p.url})`)] : []),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=300" },
  });
}
