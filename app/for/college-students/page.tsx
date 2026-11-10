import Link from "next/link";
import { pageMetadata } from "@/lib/seo/site";
import { Callout, SAMPLE, SampleLeaks, SeoPage } from "@/components/seo/blocks";

const STUDENT = ["Spotify", "Hulu", "Apple subscriptions", "DashPass", "Peacock", "ATM fee", "Monthly account fee"];
const picked = [...SAMPLE.leaks, ...SAMPLE.fees].filter((l) => STUDENT.includes(l.merchant));
const perMonth = picked.reduce((a, l) => a + l.monthly, 0);
const money = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PATH = "/for/college-students";
export const metadata = pageMetadata(PATH);

const FAQ = [
  {
    q: "What is the easiest subscription tracker for a college student?",
    a: "One that needs no setup. With Budgeto you download last month's statement PDF from your bank's app and drop it in; it lists every recurring charge in about 5 seconds. Nothing to connect, no categories to build, nothing to keep updated.",
  },
  {
    q: "Does it work if my parents pay my card?",
    a: "Yes, as long as you can download the statement. Budgeto only reads the PDF you upload; it never connects to anyone's bank account, so no one has to share a login.",
  },
  {
    q: "Can it catch free trials before they turn into charges?",
    a: "It catches them the first time they charge, because it reads charges that already happened. To avoid that first charge, put a reminder in your calendar the day you start any free trial, a day before it ends.",
  },
  {
    q: "Is Budgeto free for students?",
    a: "Scanning is free to try for everyone, and it shows the first recurring charge it finds. The full leak report is part of the paid plans; there is no separate student price.",
  },
];

export default function Page() {
  return (
    <SeoPage
      path={PATH}
      label="For college students"
      h1="A subscription tracker for college students that takes 5 seconds"
      answer={
        <p>
          Download last month&apos;s statement from your bank app, drop the PDF here, and see{" "}
          <b className="font-semibold text-white">every charge that renews by itself</b>: streaming, music, the gym back home, app store plans, bank fees. No bank login, no budget
          to set up, nothing to maintain between classes.
        </p>
      }
      faq={FAQ}
      related={["/guides/find-forgotten-subscriptions", "/guides/get-bank-fees-waived", "/vs/ynab", "/bank-statement-analyzer"]}
    >
      <h2>Why student money leaks</h2>
      <p>Small recurring charges hurt most on a small, irregular budget. They also pile up in ways specific to student life:</p>
      <ul>
        <li>
          <strong>Free trials that convert.</strong> A trial started for one assignment or one show turns into a monthly charge nobody remembers.
        </li>
        <li>
          <strong>Student pricing that quietly ends.</strong> Many student plans must be re-verified, often once a year, and switch to the full price when they lapse or when you
          graduate.
        </li>
        <li>
          <strong>Doubles.</strong> Your own streaming plan on top of the family one you are still on, or two music services.
        </li>
        <li>
          <strong>The gym back home.</strong> Memberships keep billing after you move for the semester, and many must be canceled in person or by phone.
        </li>
        <li>
          <strong>App store bundles.</strong> On a statement, every iPhone subscription shows up as one line, <code>APPLE.COM/BILL</code>, so you can&apos;t tell what is inside.
        </li>
        <li>
          <strong>Bank fees on low balances.</strong> Overdraft, non-network ATM and monthly service fees hit hardest when the balance is low. They can often be refunded if you
          ask: <Link href="/guides/get-bank-fees-waived">here is what to say</Link>.
        </li>
      </ul>

      <h2>What a scan looks like</h2>
      <p>
        These are the student-sized charges Budgeto flagged on its example statement (a two-month checking account, not a real person&apos;s): small amounts, every month.
      </p>
      <SampleLeaks only={STUDENT} />
      <p>
        {picked.length} charges, none above {money(Math.max(...picked.map((l) => l.amount)))}, yet together {money(perMonth)} a month: {money(perMonth * 12)} a year. That is the
        point of looking at them as one list instead of one at a time.
      </p>

      <h2>A 10-minute routine for the start of each semester</h2>
      <ol>
        <li>Open your bank app, go to Statements, and download the last statement as a PDF. Do the same for any credit card.</li>
        <li>Drop each PDF into Budgeto and read the list.</li>
        <li>
          For each line, ask two questions: did I use it in the last 30 days, and would I sign up again at this price? If not, cancel it with the steps shown next to it.
        </li>
        <li>
          Open your phone&apos;s subscriptions page (iPhone: Settings → your name → Subscriptions; Android: Play Store → profile → Payments &amp; subscriptions) to see what is
          hiding behind the app store line.
        </li>
        <li>Mark what you kept as &ldquo;I still use it&rdquo;, so next semester only new charges stand out.</li>
      </ol>
      <Callout>
        Starting a free trial? Put a reminder in your calendar for the day before it ends. Budgeto finds charges after they happen; a reminder stops the first one.
      </Callout>

      <h2>Why no bank login matters here</h2>
      <p>
        Plenty of students bank on an account a parent co-owns, or use a card someone else pays. Budgeting apps that connect to the bank need that login. Budgeto only needs the
        PDF statement, which you can download yourself, and it never stores the file.
      </p>
      <p>
        Want a full budget too? A budgeting app such as YNAB is built for that (it has offered a student program; check its site for the current terms). See{" "}
        <Link href="/vs/ynab">YNAB vs Budgeto</Link> for which one does what.
      </p>
    </SeoPage>
  );
}
