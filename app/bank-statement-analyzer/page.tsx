import Link from "next/link";
import { pageMetadata } from "@/lib/seo/site";
import { BudgetoPrices, Callout, DecodeTable, SAMPLE, SampleLeaks, SeoPage } from "@/components/seo/blocks";

const PATH = "/bank-statement-analyzer";
export const metadata = pageMetadata(PATH);

const FAQ = [
  {
    q: "Is there a free bank statement analyzer?",
    a: "Budgeto is free to try: upload a statement and it reads every transaction and shows you the first recurring charge it found, with no account and no card. The full leak report (every charge, the monthly and yearly total, the fee list) needs a paid plan.",
  },
  {
    q: "Which bank statements can it read?",
    a: "Checking and credit card statements from US banks and card issuers, as the PDF you download from the bank's website or app. That PDF has the text inside, so every line is read exactly. Amounts are read in US dollars.",
  },
  {
    q: "Does it need my bank login?",
    a: "No. You upload a file you already have. Budgeto never asks for your bank username or password and never connects to your accounts, so it cannot move money or see anything you did not upload.",
  },
  {
    q: "Is my statement stored?",
    a: "No. The PDF is read once to list the transactions and then discarded. Only the resulting leak report is saved to your account, and you can delete it, or your whole account, at any time.",
  },
  {
    q: "Can it catch yearly subscriptions?",
    a: "Only if the renewal is on the statement you upload. A yearly charge shows up once a year, so to catch those, scan the statement from the month it renewed, or a statement covering several months.",
  },
];

export default function Page() {
  const fees = SAMPLE.fees.length;
  const leaks = SAMPLE.leaks.length;
  return (
    <SeoPage
      path={PATH}
      label="Bank statement analyzer"
      h1="AI bank statement analyzer that finds your recurring charges"
      answer={
        <p>
          Upload a bank statement PDF and Budgeto reads every line, groups the charges by merchant and flags what repeats:{" "}
          <b className="font-semibold text-white">subscriptions, recurring bills and bank fees</b>, with a monthly and yearly total. About 5 seconds, no bank login. Try it
          on your own statement below, or on our example.
        </p>
      }
      faq={FAQ}
      prices
      related={["/guides/find-forgotten-subscriptions", "/rocket-money-alternative", "/guides/get-bank-fees-waived", "/vs/copilot"]}
    >
      <h2>What you get back</h2>
      <p>
        This is the real result of Budgeto&apos;s analyzer on its two-month example statement: {SAMPLE.transactions_count} transactions read, {leaks} recurring charges and{" "}
        {fees} bank fees flagged, everything else (rent, groceries, gas) left alone.
      </p>
      <SampleLeaks />
      <p>
        Each line comes with why it was flagged (&ldquo;charged 2 times, monthly&rdquo;) and where to cancel it (for example &ldquo;hulu.com/account → Cancel&rdquo;). Bank fees come
        with what to ask your bank. You then mark each one &ldquo;I still use it&rdquo; or &ldquo;I cancelled it&rdquo;, and the savings tracker counts what you freed up.
      </p>

      <h2>It reads the codes your bank prints</h2>
      <p>
        Statements rarely say &ldquo;Hulu&rdquo;. They say <code>HULU 877-8244858 CA</code>. The analyzer strips the phone numbers, store numbers and state codes, then matches what
        is left against the subscription services it knows (more than 45, from Netflix to SiriusXM) and the fee types banks charge.
      </p>
      <DecodeTable />

      <h2>How the analysis works</h2>
      <ol>
        <li>
          <strong>Read.</strong> The text of the PDF is read line by line: date, description, amount. Nothing is typed by you.
        </li>
        <li>
          <strong>Group.</strong> Charges are grouped by merchant once the noise is removed, so <code>NETFLIX.COM 866-579-7172 CA</code> on the 2nd of each month becomes one line,
          &ldquo;Netflix&rdquo;.
        </li>
        <li>
          <strong>Spot what repeats.</strong> A merchant is flagged when the same amount comes back on a weekly, monthly, quarterly or yearly rhythm, or when it is a known
          subscription service.
        </li>
        <li>
          <strong>Flag the fees.</strong> Overdraft and NSF, monthly service, ATM, foreign transaction, late, interest, wire, transfer and paper statement fees are listed separately.
        </li>
        <li>
          <strong>Add it up.</strong> Every flagged charge is converted to a monthly amount (a $120 yearly plan counts as $10 a month), then totalled per month and per year.
        </li>
      </ol>
      <p>
        Rent, utilities, groceries, transfers and cash withdrawals repeat too, but they are not leaks, so they are not flagged; they still appear in the spending by category.
      </p>

      <h2>What it does not do</h2>
      <ul>
        <li>
          <strong>It cannot see whether you use a service.</strong> No app can. It shows every recurring charge, and you decide what goes.
        </li>
        <li>
          <strong>It does not cancel for you.</strong> It tells you where to cancel; nobody gets access to your accounts.
        </li>
        <li>
          <strong>It only sees what is on the statement.</strong> A yearly renewal from March will not be on September&apos;s statement. Scan the month it renewed.
        </li>
        <li>
          <strong>It is not a budgeting app.</strong> No envelopes, no categories to maintain. If you want that, see <Link href="/vs/ynab">YNAB vs Budgeto</Link>.
        </li>
      </ul>

      <h2>Get your statement PDF</h2>
      <p>
        Every major US bank lets you download statements as a PDF. Sign in on the bank&apos;s website or app, open the account, and look for <strong>Statements</strong> (Chase, Bank
        of America and Wells Fargo call it &ldquo;Statements &amp; Documents&rdquo;). Pick last month and download. For a credit card, do the same in the card&apos;s account: most
        subscriptions are billed to cards.
      </p>
      <Callout>
        <strong>Tip:</strong> scan your checking account and your main credit card. Subscriptions often sit on the card, while fees sit on the checking account.
      </Callout>

      <h2>Privacy</h2>
      <p>
        The file travels over an encrypted connection, is read once, and is thrown away. Budgeto stores the leak report, not the PDF, and never sells data. You can delete a
        report, or your account and everything in it, from the account page. More in the <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Price</h2>
      <p>
        <BudgetoPrices />
      </p>
    </SeoPage>
  );
}
