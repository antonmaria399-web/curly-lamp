import Link from "next/link";
import { pageMetadata } from "@/lib/seo/site";
import { Callout, InlineCTA, SAMPLE, SampleLeaks, SeoPage, Sources } from "@/components/seo/blocks";

const PATH = "/guides/get-bank-fees-waived";
export const metadata = pageMetadata(PATH);

const FAQ = [
  {
    q: "Will my bank really refund a fee if I ask?",
    a: "Often, especially for a first or occasional overdraft fee or a monthly service fee, and especially if you have been a customer for a while. Banks are not required to, so ask politely, name the exact fee and date, and ask for a one-time courtesy refund.",
  },
  {
    q: "Should I call or use chat?",
    a: "Call if you can: a phone representative can usually see your history and apply a courtesy refund on the spot, and you can ask for a supervisor if the first answer is no. Chat works too at many banks; keep a copy of the conversation either way.",
  },
  {
    q: "How do I stop paying the monthly service fee for good?",
    a: "Ask what the waiver conditions are on your account. Many checking accounts waive the monthly fee with a direct deposit, a minimum balance, or for students. If you can't meet them, ask to switch to an account without a monthly fee, or move to a bank that doesn't charge one.",
  },
  {
    q: "Can I complain to the CFPB about a bank fee?",
    a: "If you think a fee was charged in error or against your account terms and the bank won't fix it, yes: you can submit a complaint at consumerfinance.gov/complaint. A complaint is not a way to get a fee you agreed to waived, but the bank must respond to it.",
  },
];

export default function Page() {
  const fees = SAMPLE.fees;
  const perMonth = fees.reduce((a, f) => a + f.monthly, 0);
  const money = (n: number) => "$" + n.toFixed(2);
  return (
    <SeoPage
      path={PATH}
      label="Guide"
      h1="How to get bank fees waived: the word-for-word script"
      answer={
        <p>
          Call your bank, <b className="font-semibold text-white">name the exact fee and date, mention how long you&apos;ve been a customer, and ask for a one-time courtesy
          refund</b>. If the answer is no, ask once more politely, then ask for a supervisor. Then ask how to avoid the fee in the future. The full script is below.
        </p>
      }
      faq={FAQ}
      related={["/guides/stop-recurring-charges", "/guides/find-forgotten-subscriptions", "/bank-statement-analyzer", "/for/college-students"]}
    >
      <h2>First, find every fee</h2>
      <p>
        Fees hide between ordinary transactions and their names vary by bank: <code>MONTHLY SERVICE FEE</code>, <code>MAINTENANCE FEE</code>, <code>NON-NETWORK ATM FEE</code>,{" "}
        <code>OD FEE</code>, <code>NSF</code>, <code>FOREIGN TRANSACTION FEE</code>, <code>PAPER STATEMENT FEE</code>. Budgeto lists them separately from your subscriptions. On
        its two-month example statement it found:
      </p>
      <SampleLeaks only={fees.map((f) => f.merchant)} />
      <p>
        {fees.length} fees that come back every month: {money(perMonth)} a month, {money(perMonth * 12)} a year, for nothing. Exactly the kind of fee one phone call can remove.
      </p>

      <h2>The script</h2>
      <p>Have your statement open. Call the number on the back of your card and ask for customer service.</p>
      <blockquote>
        <p>
          &ldquo;Hi, I&apos;ve been a customer since <em>[year]</em>. I&apos;m looking at my statement and I see a <em>[fee name]</em> of <em>[$ amount]</em> on{" "}
          <em>[date]</em>. I&apos;d like to ask you to refund it as a one-time courtesy. Can you do that for me today?&rdquo;
        </p>
      </blockquote>
      <p>If they say yes, say thank you and go to &ldquo;Stop the next one&rdquo; below. If they say no:</p>
      <blockquote>
        <p>
          &ldquo;I understand. I&apos;ve been a loyal customer and I&apos;d like to keep banking with you, but this fee makes that hard. Is there anything you can do, even a partial
          refund? If not, could I speak with a supervisor?&rdquo;
        </p>
      </blockquote>
      <p>And with the supervisor, the same request, calmly. If the answer is still no:</p>
      <blockquote>
        <p>
          &ldquo;Okay. Then can you tell me what I need to do so this fee isn&apos;t charged again? And is there an account without a monthly fee that I can switch to?&rdquo;
        </p>
      </blockquote>
      <Callout>
        <strong>What makes it work:</strong> the exact fee and date (they find it in seconds), your history with the bank, a clear and specific ask, and staying friendly. Note the
        representative&apos;s name and the date of the call.
      </Callout>

      <h2>Fee by fee</h2>
      <h3>Overdraft and NSF fees</h3>
      <p>
        The easiest to get refunded when it is a first or rare overdraft. Then, to avoid the next one: ask the bank to decline transactions that would overdraw the account
        instead of paying them for a fee, set up a low-balance alert, or link a savings account as overdraft protection (ask whether that transfer has its own fee).
      </p>
      <h3>Monthly service (maintenance) fees</h3>
      <p>
        Ask what waives it on your account. Common conditions are a direct deposit, a minimum daily balance, or student status. If you can&apos;t meet any of them, ask to move to
        an account with no monthly fee.
      </p>
      <h3>ATM fees</h3>
      <p>
        A non-network ATM can cost you twice: your bank&apos;s fee and the ATM owner&apos;s surcharge. Ask for a refund of your bank&apos;s fee, then use your bank&apos;s app to find
        in-network ATMs, or get cash back at a store checkout.
      </p>
      <h3>Foreign transaction fees</h3>
      <p>Ask for a refund if it was a one-off, such as an online purchase from a company billing from abroad. For travel, use a card without foreign transaction fees.</p>
      <h3>Paper statement fees</h3>
      <p>Switch to e-statements in the app; the fee stops with the next cycle. Ask for the last one back while you are on the phone.</p>

      <h2>Stop the next one</h2>
      <ol>
        <li>Ask on the call what triggers the fee and how to avoid it on your account.</li>
        <li>Turn on low-balance alerts in your bank app.</li>
        <li>
          Scan next month&apos;s statement: if a fee is back, call again with the same script, or consider changing accounts. While you are there, look for{" "}
          <Link href="/guides/find-forgotten-subscriptions">subscriptions you forgot</Link>.
        </li>
      </ol>
      <InlineCTA text="Find my fees" />

      <Sources
        items={[
          ["CFPB: your top five questions about checking accounts", "https://consumerfinance.gov/about-us/blog/your-checking-accounts-questions-answered"],
          ["Ramit Sethi, I Will Teach You To Be Rich: how to get bank and overdraft fees waived", "https://www.iwillteachyoutoberich.com/get-bank-and-overdraft-fees-waived/"],
          ["CFPB: submit a complaint", "https://www.consumerfinance.gov/complaint/"],
        ]}
      />
    </SeoPage>
  );
}
