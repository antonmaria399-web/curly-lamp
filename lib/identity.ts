/**
 * ONE identity for Budgeto, used word for word on the home page, /about, the meta description,
 * the JSON-LD and /llms.txt. Change it here only (GEO rule: the same sentence everywhere).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://budgetoo-nine.vercel.app").replace(/\/+$/, "");

export const NAME = "Budgeto";

/** One sentence: what it is, for whom, the result. Also the meta description. */
export const ONE_LINER =
  "Budgeto is an AI app that finds the forgotten subscriptions and hidden fees in your bank statement PDF, so people who want to save more money can cancel them. No bank login.";

/** The 50-word version. */
export const SHORT =
  "Budgeto is an AI money-leak finder for people who want to save more money. Upload the PDF bank statement you have; in seconds Budgeto lists every recurring charge, forgotten subscription and hidden bank fee, with steps to cancel each, and tracks what you save. No bank login, no manual entry.";

/** The name is shared with other products: tell the AIs apart (schema.org disambiguatingDescription). */
export const DISAMBIGUATION =
  "Budgeto (budgetoo-nine.vercel.app) is the US web app that scans bank statement PDFs for forgotten subscriptions and fees; it is not the Budgeto business-budget software on the Xero App Store, the Belgian Budgeto monthly-budget calculator, or the Bugeto and Budgito expense-tracker apps.";

/**
 * The owner's real public profiles. Empty until they exist: never invent one.
 * Added here → JSON-LD sameAs, /llms.txt and the footer pick them up.
 */
export const PROFILES: { name: string; url: string }[] = [];

export const FEATURES: [string, string][] = [
  ["PDF Statement Scan", "Upload the PDF statement from your bank's website or app. Transactions are read and sorted automatically. No typing, no bank link."],
  ["Leak report", "Every recurring charge and forgotten subscription, with the amount, how often it bills, and the monthly and yearly total."],
  ["Cancel steps", "The exact steps to cancel each subscription yourself (where to click, or who to call). 45+ services recognized."],
  ["Hidden Fee Hunter", "Overdraft, ATM and monthly service fees flagged, with a script to ask your bank to waive them."],
  ["Savings Goal Tracker", "Set a monthly target. Every charge you cancel counts toward it."],
  ["Compare over time", "Scan next month's statement and see new subscriptions, price hikes and fees that came back."],
  ["Faceless Export", "Clean stat screens of your results for TikTok, Reels and Shorts, with no name or account numbers."],
];

export const PAGES: [string, string, string][] = [
  ["/", "Home", "Try Budgeto on a statement PDF or a sample statement, free."],
  ["/about", "What is Budgeto?", "What Budgeto is, who it is for, features, prices, Budgeto vs YNAB."],
  ["/privacy", "Privacy", "What Budgeto keeps and how to delete it."],
  ["/terms", "Terms", "Terms of service."],
];
