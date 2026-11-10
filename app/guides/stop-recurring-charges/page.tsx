import Link from "next/link";
import { pageMetadata } from "@/lib/seo/site";
import { Callout, InlineCTA, SAMPLE, SeoPage, Sources } from "@/components/seo/blocks";

const PATH = "/guides/stop-recurring-charges";
export const metadata = pageMetadata(PATH);

const FAQ = [
  {
    q: "Can my bank stop a recurring charge?",
    a: "Yes. According to the CFPB, you can tell your bank you have revoked a company's permission to take automatic payments, and you can give a stop payment order at least three business days before a scheduled payment from your bank account. Banks may charge a fee for a stop payment, and you should also cancel with the company.",
  },
  {
    q: "Does canceling my card stop subscriptions?",
    a: "Not always. Card networks run updater services that can pass your new card number to merchants who already bill you, so some subscriptions keep going on the replacement card. Cancel with each company first.",
  },
  {
    q: "What if a company keeps charging me after I canceled?",
    a: "Contact the company with your cancellation confirmation and ask for a refund. If it refuses, dispute the charge with your bank or card issuer quickly; for credit cards, the FTC says to dispute in writing within 60 days of the date the first statement with the charge was sent to you.",
  },
  {
    q: "Is there still a federal click-to-cancel rule?",
    a: "Not one in force. A federal appeals court vacated the FTC's click-to-cancel rule in July 2025 before it took full effect, and the FTC has reopened the rulemaking. Several states have their own automatic-renewal laws, and the FTC still pursues deceptive subscription practices.",
  },
];

export default function Page() {
  const subs = SAMPLE.leaks.filter((l) => l.kind === "subscription").slice(0, 4);
  return (
    <SeoPage
      path={PATH}
      label="Guide"
      h1="How to stop a recurring charge for good"
      answer={
        <>
          <p>
            <b className="font-semibold text-white">1. Cancel with the company and keep the proof. 2. Tell your bank you revoked the payment. 3. Ask for a stop payment</b> at
            least three business days before the next charge if it&apos;s from your bank account. <b className="font-semibold text-white">4. Dispute it</b> if it comes back. Each
            step below, with what the CFPB says you are entitled to.
          </p>
        </>
      }
      faq={FAQ}
      related={["/guides/find-forgotten-subscriptions", "/guides/get-bank-fees-waived", "/rocket-money-alternative", "/bank-statement-analyzer"]}
    >
      <h2>Before you start: know exactly what you are canceling</h2>
      <p>
        You need the company&apos;s real name, the account (email address) it is billed to, the amount, and the date it renews. A bank statement has the amount and date but prints
        the name as a code. Budgeto decodes it and puts the cancel route next to each charge, for example:
      </p>
      <ul>
        {subs.map((l) => (
          <li key={l.key}>
            <strong>{l.merchant}</strong> (${l.amount.toFixed(2)} {l.cadence}): {l.cancel_hint}
          </li>
        ))}
      </ul>
      <p className="text-[14px] text-zinc-500">From Budgeto&apos;s scan of its example statement. Menus change; the company&apos;s help page has the current path.</p>

      <h2>Step 1. Cancel with the company</h2>
      <ul>
        <li>
          <strong>Billed by Apple or Google?</strong> Cancel in the store, not in the app: iPhone Settings → your name → Subscriptions; Android Play Store → profile →
          Payments &amp; subscriptions. Deleting the app does not cancel it.
        </li>
        <li>
          <strong>Billed directly?</strong> Sign in on the company&apos;s website, then Account, Billing or Membership → Cancel. If you can&apos;t find it, use the chat or phone
          line and ask them to confirm the cancellation by email.
        </li>
        <li>
          <strong>Gyms and memberships</strong> may require a letter, a visit or a phone call. Send it in writing anyway and keep a copy.
        </li>
      </ul>
      <Callout>
        Keep proof: a screenshot of the confirmation screen, the confirmation email, or the name of the person and the date if it was by phone. You will need it in step 4.
      </Callout>

      <h2>Step 2. Revoke the payment with your bank</h2>
      <p>
        The CFPB&apos;s guidance: tell the company you are revoking its permission to take automatic payments, then call and write your bank or credit union to say you have
        revoked it. Some banks have an online form for this. The CFPB publishes a sample letter you can adapt (linked in the sources below).
      </p>

      <h2>Step 3. Stop the payment (bank account debits)</h2>
      <p>
        For automatic payments from a bank account, you can give your bank a <strong>stop payment order</strong>. The CFPB says the bank must honor an order given at least three
        business days before the scheduled payment, may ask you to confirm it in writing, and may charge a fee. Debit card charges can be harder to stop; ask your bank whether it
        can block that merchant on your card.
      </p>
      <p>
        On a <strong>credit card</strong>, call the issuer and ask it to block future charges from the merchant. Some issuers also let you lock a card or create virtual card
        numbers for subscriptions, which you can turn off yourself.
      </p>

      <h2>Step 4. If it charges again: dispute it</h2>
      <ol>
        <li>Contact the company with your proof and ask for a refund. Many refund at this point.</li>
        <li>
          If not, dispute the charge with your bank or card issuer, quickly. For credit cards, the FTC says to send a written dispute to the billing-disputes address within 60
          days of the date the first statement with the error was sent to you (a phone dispute is fine to start, but follow it with a letter). For debit and bank account payments, tell your bank as soon as you see it; the CFPB says you can ask your bank for a refund of a payment
          taken after you revoked authorization.
        </li>
        <li>If the bank doesn&apos;t fix it, file a complaint with the CFPB at consumerfinance.gov/complaint.</li>
      </ol>

      <h2>What the law says in 2026</h2>
      <p>
        The FTC&apos;s federal &ldquo;click-to-cancel&rdquo; rule was vacated by the U.S. Court of Appeals for the Eighth Circuit in July 2025, and the FTC has reopened the
        rulemaking, so there is no federal click-to-cancel requirement in force. State automatic-renewal laws (California&apos;s is the best known) still require clear cancellation
        options in many cases, and your rights over automatic bank payments come from federal electronic funds transfer rules, which is what the CFPB guidance above is based on.
      </p>

      <h2>Make sure it stays stopped</h2>
      <p>
        Look at next month&apos;s statement. The CFPB recommends monitoring your account and alerting your bank right away if a payment you stopped comes through. A quick way:
        scan the new statement with Budgeto and check the charge is gone from the list. And while you&apos;re there, check for <Link href="/guides/get-bank-fees-waived">bank fees you can get refunded</Link>.
      </p>
      <InlineCTA text="Check my statement" />

      <Sources
        items={[
          ["CFPB: How do I stop automatic payments from my bank account?", "https://www.consumerfinance.gov/ask-cfpb/how-do-i-stop-automatic-payments-from-my-bank-account-en-2023/"],
          ["CFPB: sample letter to revoke automatic debit authorization (.doc)", "https://files.consumerfinance.gov/f/201511_cfpb_sample-revocation-letter-to-your-bank-or-credit-union.doc"],
          ["CFPB: Regulation E § 1005.10, preauthorized transfers", "https://www.consumerfinance.gov/rules-policy/regulations/1005/10/"],
          ["Jones Day: FTC revives click-to-cancel rule after Eighth Circuit vacatur (May 2026)", "https://www.jonesday.com/en/insights/2026/05/ftc-revives-clicktocancel-rule-new-risks-for-subscription-businesses"],
          ["FTC: Using credit cards and disputing charges", "https://consumer.ftc.gov/articles/using-credit-cards-and-disputing-charges"],
          ["CFPB: submit a complaint", "https://www.consumerfinance.gov/complaint/"],
        ]}
      />
    </SeoPage>
  );
}
