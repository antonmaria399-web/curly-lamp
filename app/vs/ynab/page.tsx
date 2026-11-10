import Link from "next/link";
import { pageMetadata } from "@/lib/seo/site";
import { BudgetoPrices, CompareTable, SampleLeaks, SeoPage, Sources } from "@/components/seo/blocks";

const PATH = "/vs/ynab";
export const metadata = pageMetadata(PATH);

const FAQ = [
  {
    q: "Is Budgeto a YNAB alternative?",
    a: "Only for one job. YNAB is a full budgeting method you run every week. Budgeto does not budget; it scans a bank statement PDF and lists your subscriptions, recurring charges and bank fees. If what you want from YNAB is to stop money leaking, Budgeto gets you that list in seconds. If you want to plan every dollar, YNAB is the tool.",
  },
  {
    q: "How much does YNAB cost compared to Budgeto?",
    a: "YNAB lists $14.99 a month or $109 a year after a 34-day free trial. Budgeto is free to try, and its paid plans, read live from our billing system, are shown in the comparison table on this page.",
  },
  {
    q: "Does YNAB find forgotten subscriptions?",
    a: "You will see recurring charges as you categorize transactions in YNAB, and you can track them as scheduled transactions. It does not hand you a ready-made list of forgotten subscriptions; that list is what Budgeto's scan produces.",
  },
  {
    q: "Do I need to link my bank to YNAB?",
    a: "No. YNAB lets you link accounts or track them manually by typing or importing transactions. Budgeto never links: you upload the statement PDF.",
  },
  {
    q: "Can I use YNAB and Budgeto together?",
    a: "Yes, and it is a sensible order: scan a statement with Budgeto to find what to cancel, then build your YNAB budget on the smaller set of bills that are left.",
  },
];

export default function Page() {
  return (
    <SeoPage
      path={PATH}
      label="YNAB vs Budgeto"
      h1="YNAB vs Budgeto: plan every dollar, or find the ones leaking?"
      answer={
        <p>
          <b className="font-semibold text-white">YNAB is a budgeting method</b>: you give every dollar a job and keep the budget up to date every week.{" "}
          <b className="font-semibold text-white">Budgeto is a 5-second scan</b> of a bank statement PDF that lists your subscriptions and fees. Different jobs. If your question is
          &ldquo;where is my money leaking?&rdquo;, Budgeto answers it tonight; if it is &ldquo;how do I plan every paycheck?&rdquo;, YNAB does.
        </p>
      }
      faq={FAQ}
      prices
      related={["/rocket-money-alternative", "/vs/copilot", "/guides/find-forgotten-subscriptions", "/for/college-students"]}
    >
      <h2>The comparison</h2>
      <CompareTable
        them="YNAB"
        rows={[
          ["What it is", "Zero-based budgeting app and method (“give every dollar a job”)", "Statement scanner that finds recurring charges and fees"],
          ["Bank connection", "Optional: link accounts, or enter and import transactions yourself", "None. You upload a PDF statement"],
          ["Setup before the first insight", "Add accounts, create categories, assign your money", "None. Drop the file"],
          ["Forgotten subscriptions", { meh: "Visible as you categorize; no ready-made list" }, { yes: "Listed on the first screen, with monthly and yearly totals" }],
          ["Bank fees", { meh: "Visible as transactions" }, { yes: "Flagged, with what to ask your bank" }],
          ["Budgeting and goals", { yes: "Yes, it is the core of the app" }, { meh: "A savings goal tracker only" }],
          ["Devices", "iPhone, Android and web", "Any browser, on phone or computer"],
          ["Free trial", "34 days", "Free scan, no account needed"],
          ["Price", "$14.99/month or $109/year", <BudgetoPrices key="p" />],
        ]}
      />

      <h2>When YNAB is the better choice</h2>
      <p>
        Choose YNAB if you want to change how you plan money, not just find leaks. Its method asks you to assign every dollar before you spend it and to check in often. People
        who stick with that habit get a full picture of where each paycheck goes. YNAB also handles shared budgets, goals for irregular expenses and loan payoff planning, none
        of which Budgeto does.
      </p>

      <h2>When Budgeto is the better choice</h2>
      <p>
        Choose Budgeto if you want an answer before you commit to a system. A budget is easier to keep when the forgotten charges are already gone, and finding them in YNAB means
        categorizing your way through every transaction first. Budgeto skips that: it reads a statement you already have and returns the list, with where to cancel each one.
      </p>
      <p>Here is that list on Budgeto&apos;s example statement:</p>
      <SampleLeaks />

      <h2>Using both</h2>
      <ol>
        <li>Scan last month&apos;s checking and credit card statements with Budgeto.</li>
        <li>Cancel what you no longer use; mark the rest &ldquo;I still use it&rdquo;.</li>
        <li>
          Build your YNAB budget with the subscriptions you kept as known monthly expenses. Fewer bills, fewer categories, an easier first month. (Need help canceling? Read{" "}
          <Link href="/guides/stop-recurring-charges">how to stop a recurring charge for good</Link>.)
        </li>
      </ol>

      <Sources
        items={[
          ["YNAB: pricing and 34-day free trial", "https://www.ynab.com/pricing"],
          ["Copilot Money: Copilot vs YNAB (lists YNAB at $14.99/mo or $109/yr, 34-day trial)", "https://www.copilot.money/compare/ynab"],
        ]}
      />
    </SeoPage>
  );
}
