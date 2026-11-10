import Link from "next/link";
import { pageMetadata } from "@/lib/seo/site";
import { Callout, DecodeTable, InlineCTA, SampleLeaks, SeoPage } from "@/components/seo/blocks";

const PATH = "/guides/find-forgotten-subscriptions";
export const metadata = pageMetadata(PATH);

const FAQ = [
  {
    q: "How do I see all my subscriptions in one place?",
    a: "There is no single place that knows every subscription, because they are billed through different channels: your bank and cards, Apple or Google, PayPal and Amazon. Your bank and card statements are the closest thing, since almost every subscription ends up there. Scan them, then open the app store and PayPal lists to see what hides behind their single line.",
  },
  {
    q: "How far back should I look?",
    a: "One month catches monthly subscriptions. Yearly renewals only appear once a year, so look through 12 months of statements, or at least the months when you remember signing up for things.",
  },
  {
    q: "What does APPLE.COM/BILL mean on my statement?",
    a: "It is how Apple bills App Store, iCloud+, Apple Music, Apple TV+ and in-app subscriptions. One line can include several subscriptions. On an iPhone, open Settings, tap your name, then Subscriptions to see each one; reportaproblem.apple.com shows every Apple charge.",
  },
  {
    q: "Can I cancel a subscription through my bank?",
    a: "Your bank can stop future payments to a merchant if you ask, but cancel with the company too, or you may still owe them. The full steps, including what the CFPB says about stopping automatic payments, are in our guide to stopping recurring charges.",
  },
  {
    q: "Is there an app that finds forgotten subscriptions without my bank login?",
    a: "Budgeto does it from the PDF statement you download from your bank, without connecting to your account. It lists recurring charges and bank fees in about 5 seconds.",
  },
];

export default function Page() {
  return (
    <SeoPage
      path={PATH}
      label="Guide"
      h1="How to find subscriptions you forgot you’re paying for"
      answer={
        <>
          <p>
            Check six places: <b className="font-semibold text-white">your bank statements, your credit card statements, Apple or Google subscriptions, PayPal, Amazon, and your
            email</b>. Look back 12 months to catch yearly renewals. The statements are the one place nearly every subscription shows up, so start there.
          </p>
          <p className="mt-3">Shortcut: drop a statement below and Budgeto lists the recurring charges in about 5 seconds.</p>
        </>
      }
      faq={FAQ}
      related={["/guides/stop-recurring-charges", "/guides/get-bank-fees-waived", "/bank-statement-analyzer", "/for/college-students"]}
    >
      <h2>1. Your bank statements</h2>
      <p>
        Download the last statement of your checking account as a PDF (Statements, or Statements &amp; Documents, in your bank&apos;s app or website) and look for charges that come
        back on the same day each month, for the same amount. The hard part is that the names are printed as billing codes. Here is how some of them look on a real-format
        statement, and what they actually are:
      </p>
      <DecodeTable />
      <p>
        Tip: search the code itself (for example <code>ADOBE *CREATIVE CLD</code>) in your email. The receipt tells you which account and which email address it was bought with.
      </p>

      <h2>2. Your credit card statements</h2>
      <p>
        Most subscriptions are billed to cards, not checking. Repeat step 1 for every card you have, including the old one in the drawer: if a card is still open, merchants can
        keep charging it. If a card was replaced after it was lost, card networks often pass the new number to merchants automatically, so subscriptions follow the new card.
      </p>

      <h2>3. Apple and Google subscriptions</h2>
      <p>One <code>APPLE.COM/BILL</code> or <code>GOOGLE *</code> line can hide several subscriptions. To see each one:</p>
      <ul>
        <li>
          <strong>iPhone or iPad:</strong> Settings → your name → Subscriptions. Expired ones are listed too, which helps you spot what renewed.
        </li>
        <li>
          <strong>Android:</strong> Google Play Store → your profile picture → Payments &amp; subscriptions → Subscriptions.
        </li>
        <li>
          <strong>Every Apple charge, with dates:</strong> reportaproblem.apple.com, signed in with your Apple ID.
        </li>
      </ul>

      <h2>4. PayPal</h2>
      <p>
        Services paid through PayPal show up on your statement as <code>PAYPAL *</code> followed by a short merchant name. In PayPal, open Settings → Payments → Manage automatic
        payments to see every merchant allowed to charge you, and remove the ones you don&apos;t use.
      </p>

      <h2>5. Amazon</h2>
      <p>
        On amazon.com, open Account → Memberships &amp; Subscriptions. Prime, Kindle Unlimited, Audible, channels added inside Prime Video, and Subscribe &amp; Save are listed there.
      </p>

      <h2>6. Your email</h2>
      <p>
        Search every inbox you use, including old ones, for: <code>subscription</code>, <code>renewal</code>, <code>receipt</code>, <code>trial</code>, <code>your plan</code>,{" "}
        <code>membership</code>. Renewal notices for yearly plans often arrive weeks before the charge.
      </p>

      <h2>The 10-minute version</h2>
      <ol>
        <li>Download last month&apos;s statement for checking and for each card.</li>
        <li>Scan them with Budgeto: it groups the charges by merchant and lists what repeats, with a monthly and yearly total.</li>
        <li>Open the Apple or Google subscription list to split the app store line.</li>
        <li>For each item, ask: did I use it in the last 30 days, and would I sign up again at this price? If either answer is no, cancel it.</li>
        <li>Once a year, scan the statement from the month your yearly plans renew.</li>
      </ol>
      <p>Here is what step 2 returns on Budgeto&apos;s two-month example statement:</p>
      <SampleLeaks />
      <InlineCTA text="Scan my statement" />

      <h2>Then cancel them properly</h2>
      <Callout>
        Canceling is a separate job: cancel with the company, keep the confirmation, and know what to do if the charge comes back. Follow{" "}
        <Link href="/guides/stop-recurring-charges">how to stop a recurring charge for good</Link>. Found bank fees too? Use{" "}
        <Link href="/guides/get-bank-fees-waived">this phone script to get them refunded</Link>.
      </Callout>
    </SeoPage>
  );
}
