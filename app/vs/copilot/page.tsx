import Link from "next/link";
import { pageMetadata } from "@/lib/seo/site";
import { BudgetoPrices, CompareTable, SampleLeaks, SeoPage, Sources } from "@/components/seo/blocks";

const PATH = "/vs/copilot";
export const metadata = pageMetadata(PATH);

const FAQ = [
  {
    q: "Is Budgeto a Copilot Money alternative?",
    a: "For finding subscriptions and fees, yes, and without connecting your bank. For everything else Copilot does (budgets, investments, net worth, automatic categories on an always-synced account), no: Budgeto only scans the statements you upload.",
  },
  {
    q: "Does Copilot Money work on Android?",
    a: "There is no native Android app as of November 2026. Copilot has apps for iPhone, iPad and Mac, and since December 2025 a web app that an Android phone can open in the browser. Budgeto is browser-based on every device, so it works the same on Android, iPhone and computers.",
  },
  {
    q: "How much is Copilot Money?",
    a: "Copilot Money lists $13 a month or $95 a year, with a 30-day free trial. Budgeto is free to try, and its current paid plans are in the comparison table on this page.",
  },
  {
    q: "Does Budgeto need my bank login like Copilot?",
    a: "No. Copilot Money syncs your accounts through a bank connection. Budgeto never connects: you upload the PDF statement from your bank's website or app.",
  },
];

export default function Page() {
  return (
    <SeoPage
      path={PATH}
      label="Copilot Money vs Budgeto"
      h1="Copilot Money vs Budgeto: track everything, or find the leaks?"
      answer={
        <p>
          <b className="font-semibold text-white">Copilot Money is a polished, always-connected money tracker</b>, built for Apple devices and also on the web.{" "}
          <b className="font-semibold text-white">Budgeto is a connection-free scan</b>: drop a bank statement PDF, get your subscriptions and fees in about 5 seconds, on any phone.
          Pick Copilot to watch all your money every day; pick Budgeto to find what to cancel without linking anything.
        </p>
      }
      faq={FAQ}
      prices
      related={["/vs/ynab", "/rocket-money-alternative", "/bank-statement-analyzer", "/guides/find-forgotten-subscriptions"]}
    >
      <h2>The comparison</h2>
      <CompareTable
        them="Copilot Money"
        rows={[
          ["What it is", "Budgeting and money tracking app: spending, budgets, investments, net worth", "Statement scanner that finds recurring charges and fees"],
          ["Bank connection", "Required: your accounts sync automatically", "None. You upload a PDF statement"],
          ["Devices", "iPhone, iPad and Mac apps, plus a web app; no Android app", "Any browser: Android, iPhone, computer"],
          ["Time to first insight", "After accounts connect and transactions sync", "About 5 seconds"],
          ["Recurring charges", { yes: "Yes, a recurring view on synced accounts" }, { yes: "Yes, listed first, with cancel steps" }],
          ["Bank fees flagged", { meh: "Not a dedicated feature" }, { yes: "Yes, with what to ask your bank" }],
          ["Investments and net worth", { yes: "Yes" }, { no: "No" }],
          ["Free trial", "30 days", "Free scan, no account needed"],
          ["Price", "$13/month or $95/year", <BudgetoPrices key="p" />],
        ]}
      />

      <h2>When Copilot Money is the better choice</h2>
      <p>
        If you live on Apple devices, are fine connecting your accounts, and want one place for budgets, spending categories and investments that updates by itself, Copilot is
        built for that. Its strength is the daily view of all your money; Budgeto doesn&apos;t try to compete with it there.
      </p>

      <h2>When Budgeto is the better choice</h2>
      <ul>
        <li>You want an answer tonight without installing an app or starting a subscription trial.</li>
        <li>You don&apos;t want to connect your bank accounts to a third party.</li>
        <li>You want a one-time audit of what renews every month, not a daily tracker.</li>
        <li>
          You want your <Link href="/guides/get-bank-fees-waived">bank fees</Link> called out, not just categorized.
        </li>
      </ul>
      <p>This is what Budgeto returns on its example statement, before you&apos;ve set up anything:</p>
      <SampleLeaks />

      <h2>The honest trade-off</h2>
      <p>
        A connected app sees new charges the day they post. Budgeto sees what is on the statements you upload, so you scan again each month (it takes seconds). In exchange,
        nothing is connected, the PDF is never stored, and there is nothing to set up.
      </p>

      <Sources
        items={[
          ["Copilot Money: Copilot vs YNAB (Copilot $13/mo or $95/yr, 30-day trial)", "https://www.copilot.money/compare/ynab"],
          ["Copilot Money: Why Copilot? (features and platforms)", "https://www.copilot.money/compare/"],
          ["Copilot Money help center: Copilot Money for web", "https://help.copilot.money/en/articles/11780342-copilot-money-for-web"],
          ["Copilot Money help center: Recurrings tab overview", "https://help.copilot.money/en/articles/9778259-recurrings-tab-overview"],
          ["Copilot Money feedback board: Android app request", "https://feedback.copilot.money/feature-requests/p/copilot-android-app"],
        ]}
      />
    </SeoPage>
  );
}
