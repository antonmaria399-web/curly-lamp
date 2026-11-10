import Link from "next/link";
import { pageMetadata } from "@/lib/seo/site";
import { BudgetoPrices, CompareTable, SAMPLE, SampleLeaks, SeoPage, Sources } from "@/components/seo/blocks";

const PATH = "/rocket-money-alternative";
export const metadata = pageMetadata(PATH);

const FAQ = [
  {
    q: "Is there a Rocket Money alternative that doesn't link to my bank?",
    a: "Yes. Budgeto works from the PDF statement you download from your bank, so there is no bank login and no account connection. It lists your subscriptions, recurring charges and bank fees from that file in about 5 seconds.",
  },
  {
    q: "Does Budgeto cancel subscriptions for me like Rocket Money?",
    a: "No. Rocket Money's Premium plan includes a cancellation service; Budgeto does not. Budgeto gives you the exact place to cancel each charge (for example the account page and menu to open), and you do it yourself in a minute, without giving anyone access to your accounts.",
  },
  {
    q: "Is Budgeto free?",
    a: "Budgeto is free to try: scan a statement and you see the first recurring charge it found. The full leak report is part of the paid plans, which are shown on this page with their current prices.",
  },
  {
    q: "Can I use both?",
    a: "Yes. Some people scan a statement with Budgeto for a quick audit before deciding whether they want an always-connected app like Rocket Money. They do not need each other.",
  },
  {
    q: "Is it safe to upload a bank statement?",
    a: "Budgeto reads the PDF once over an encrypted connection and throws it away; only the leak report is kept, and you can delete it anytime. A statement cannot be used to move money, unlike a bank login.",
  },
];

export default function Page() {
  return (
    <SeoPage
      path={PATH}
      label="Rocket Money alternative"
      h1="The Rocket Money alternative that never asks for your bank login"
      answer={
        <p>
          Want Rocket Money&apos;s best trick, <b className="font-semibold text-white">the list of every subscription you pay</b>, without connecting your bank accounts? Use the PDF
          statement you already have. Budgeto reads it and lists your recurring charges in about 5 seconds. Rocket Money still does things Budgeto doesn&apos;t, so here is the honest
          split.
        </p>
      }
      faq={FAQ}
      prices
      related={["/bank-statement-analyzer", "/guides/stop-recurring-charges", "/vs/ynab", "/vs/copilot"]}
    >
      <h2>Rocket Money vs Budgeto at a glance</h2>
      <CompareTable
        them="Rocket Money"
        rows={[
          ["How it gets your transactions", "You connect your bank and card accounts", "You upload a PDF statement. No login, no connection"],
          ["Time to your subscription list", "After your accounts are connected and synced", "About 5 seconds per statement"],
          ["Finds subscriptions", { yes: "Yes" }, { yes: "Yes, plus other recurring charges" }],
          ["Flags bank fees", { meh: "Not its focus" }, { yes: "Overdraft, ATM, monthly service and 6 more fee types" }],
          ["Cancels subscriptions for you", { yes: "Yes, on Premium" }, { no: "No. Shows where and how to cancel each one" }],
          ["Bill negotiation", { yes: "Yes, paid service" }, { no: "No" }],
          ["Budgets, net worth, credit score", { yes: "Yes" }, { no: "No. A savings goal tracker only" }],
          ["Keeps tracking by itself", { yes: "Yes, while accounts stay connected" }, { meh: "You scan each new statement" }],
          ["Price", "Free plan; Premium is pay-what-you-choose, about $7–$14 a month per Rocket Money", <BudgetoPrices key="p" />],
        ]}
      />
      <p>
        In one line: Rocket Money is an always-connected money app with services on top. Budgeto is a fast, connection-free audit of the statements you already download.
      </p>

      <h2>Choose Rocket Money if…</h2>
      <ul>
        <li>you want someone to cancel subscriptions or negotiate bills for you;</li>
        <li>you want budgets, net worth and credit monitoring in the same app;</li>
        <li>you are comfortable connecting your bank accounts and want tracking with no monthly action.</li>
      </ul>

      <h2>Choose Budgeto if…</h2>
      <ul>
        <li>you don&apos;t want to hand your bank login to a third-party connection;</li>
        <li>your bank connection keeps breaking, or your credit union is not supported well;</li>
        <li>you want a one-time audit tonight, not a new app to maintain;</li>
        <li>
          you also want your <strong>bank fees</strong> flagged, with what to say to get them refunded (see <Link href="/guides/get-bank-fees-waived">the script</Link>).
        </li>
      </ul>

      <h2>What the list looks like</h2>
      <p>
        Here is what Budgeto found on its example statement: {SAMPLE.leaks.length} recurring charges and {SAMPLE.fees.length} fees across two months, from a $7.99 Peacock plan to a
        $44 storage unit.
      </p>
      <SampleLeaks />

      <h2>If you are leaving Rocket Money</h2>
      <ol>
        <li>Download the last statement of each account you had connected (checking and cards) as PDFs.</li>
        <li>Scan them in Budgeto to get your list of recurring charges back, without a connection.</li>
        <li>Cancel Rocket Money Premium from its app settings if you pay for it, so it doesn&apos;t become one more leak.</li>
        <li>
          Remove its access to your bank: most banks list third-party connections under security or &ldquo;connected apps&rdquo; settings, where you can revoke them.
        </li>
      </ol>

      <Sources
        items={[
          ["Rocket Money: How much does Rocket Money cost? (free vs Premium)", "https://www.rocketmoney.com/learn/personal-finance/how-much-does-rocket-money-cost"],
          ["Rocket Money: Rocket Money vs. YNAB (features, cancellation, bill negotiation)", "https://rocketmoney.com/learn/personal-finance/rocket-money-vs-ynab"],
        ]}
      />
    </SeoPage>
  );
}
