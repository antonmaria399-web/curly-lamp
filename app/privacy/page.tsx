import type { Metadata } from "next";
import { Legal } from "@/components/legal";
import { canonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Budgeto keeps from your bank statement, why, and how to delete it. Your PDF is read once and never stored.",
  alternates: { canonical: canonical("/privacy") },
};

export default function Privacy() {
  return (
    <Legal title="Privacy" updated="November 9, 2026">
      <h2>The short version</h2>
      <p>Your statement file is read once and never stored. We keep your leak reports so you can come back to them, and you can delete them anytime. We never sell your data and we never connect to your bank.</p>
      <h2>What we keep</h2>
      <ul>
        <li>Your email (and name, if you sign in with Google).</li>
        <li>Your leak reports: the transactions, recurring charges and totals extracted from statements you uploaded. Not the PDF itself.</li>
        <li>What you mark (“I cancelled it”, “I still use it”), your savings goal and rules.</li>
        <li>Usage: how many scans you ran, and basic product events (sign-up, paywall shown, feature used) to improve Budgeto.</li>
        <li>For free tries without an account: a random device id and your IP address, kept to limit tries to 3 a day.</li>
      </ul>
      <h2>Who helps us</h2>
      <ul>
        <li>Supabase: database and accounts (United States).</li>
        <li>Vercel: hosting.</li>
        <li>Google Gemini: reads the statement you upload to list its transactions. Files are sent for that one request.</li>
        <li>Whop, through Kwop: payments. We never see your card number.</li>
        <li>Kwop: visit analytics on our public pages (landing, sign-up, log-in), and plan and payment status.</li>
      </ul>
      <h2>Your choices</h2>
      <ul>
        <li>Delete a report: Upload → Your reports → trash icon.</li>
        <li>Delete everything: Account → Delete my account. Your data is removed right away.</li>
        <li>Shared links show only your totals (no bank, no merchants list) and only if you tap Share.</li>
      </ul>
      <h2>Cookies</h2>
      <p>We use cookies to keep you logged in, to remember a free try on this device, and to remember the link you came from (for 30 days). No ad trackers.</p>
    </Legal>
  );
}
