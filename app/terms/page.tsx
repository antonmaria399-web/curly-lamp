import type { Metadata } from "next";
import { Legal } from "@/components/legal";

export const metadata: Metadata = { title: "Terms", description: "The short, plain-English terms of Budgeto." };

export default function Terms() {
  return (
    <Legal title="Terms" updated="November 9, 2026">
      <h2>What Budgeto is</h2>
      <p>Budgeto reads a bank or card statement you upload and lists the recurring charges and fees it finds. It is an information tool, not financial, tax or legal advice. Always double-check a charge before you cancel anything.</p>
      <h2>Your account</h2>
      <p>You need an email or Google account. Keep your password safe. You can delete your account and its data anytime in Account.</p>
      <h2>Free tries and plans</h2>
      <ul>
        <li>You can try Budgeto for free (up to 3 scans a day). Full reports need a paid plan.</li>
        <li>Plans renew automatically every month or year until you cancel. Prices are in USD.</li>
        <li>Each plan includes a number of statement scans per billing period, shown before you pay.</li>
        <li>Cancel anytime in Account → Billing. You keep access until the end of the period you paid for.</li>
        <li>Payments are processed by Whop through Kwop. Their terms apply to the payment itself.</li>
      </ul>
      <h2>Fair use</h2>
      <p>Only upload statements that are yours or that you are allowed to use. Don&apos;t try to break, overload or copy the service.</p>
      <h2>Accuracy</h2>
      <p>The AI can misread a line. We show you every charge so you can check it. Budgeto is provided “as is”, and our liability is limited to what you paid us in the last 12 months.</p>
      <h2>Changes and contact</h2>
      <p>We may update these terms and will show the new date here. Questions: reply to any Budgeto email or write from your account email.</p>
    </Legal>
  );
}
