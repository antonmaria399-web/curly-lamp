import type { Metadata } from "next";

/** The public address. Every canonical, sitemap entry and JSON-LD id is built from it. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
export const abs = (path: string) => SITE_URL + (path === "/" ? "" : path);

export type SeoPage = {
  path: string;
  /** Full <title> (60 characters max, "· Budgeto" included). Its main search is in it. */
  title: string;
  /** Meta description, 155 characters max, with the main search in it. */
  description: string;
  /** The search this page answers (see SEO.md). */
  search: string;
  /** Short name used in breadcrumbs, menus and related links. */
  name: string;
  /** Lines of the Open Graph image. */
  og: { top: string; big: string; bottom: string };
  updated: string; // YYYY-MM-DD, real date of the last substantive edit
  section?: "guides" | "compare" | "for";
};

/** One page per search intent. The keyword map lives in SEO.md; keep both in sync. */
export const PAGES: SeoPage[] = [
  {
    path: "/",
    title: "Budgeto — Find the subscriptions you forgot you pay",
    description:
      "Drop your bank statement PDF. Budgeto's AI flags forgotten subscriptions and hidden fees in seconds. No bank login, no manual entry.",
    search: "find forgotten subscriptions",
    name: "Home",
    og: { top: "I found a forgotten subscription", big: "$211.86/mo", bottom: "in 5 seconds · example leak report" },
    updated: "2026-11-10",
  },
  {
    path: "/bank-statement-analyzer",
    title: "AI Bank Statement Analyzer for Recurring Charges · Budgeto",
    description:
      "Upload a bank statement PDF and see every subscription, recurring charge and bank fee in seconds. Free to try, no bank login, nothing to type.",
    search: "bank statement analyzer",
    name: "Bank statement analyzer",
    og: { top: "Bank statement analyzer", big: "54 → 13", bottom: "transactions read → leaks flagged · example" },
    updated: "2026-11-10",
    section: "compare",
  },
  {
    path: "/rocket-money-alternative",
    title: "Rocket Money Alternative With No Bank Login · Budgeto",
    description:
      "Looking for a Rocket Money alternative that doesn't ask for your bank login? Budgeto finds subscriptions from the PDF statement you already have.",
    search: "rocket money alternative",
    name: "Rocket Money alternative",
    og: { top: "Rocket Money alternative", big: "0 logins", bottom: "your PDF statement is enough" },
    updated: "2026-11-10",
    section: "compare",
  },
  {
    path: "/vs/ynab",
    title: "YNAB vs Budgeto: Budget Planner or Leak Finder? · Budgeto",
    description:
      "YNAB vs Budgeto, compared honestly: what each one does, setup time, bank access and price. Use YNAB to plan; use Budgeto to find what is leaking.",
    search: "ynab alternative / ynab vs",
    name: "YNAB vs Budgeto",
    og: { top: "YNAB vs Budgeto", big: "Plan vs find", bottom: "an honest comparison" },
    updated: "2026-11-10",
    section: "compare",
  },
  {
    path: "/vs/copilot",
    title: "Copilot Money vs Budgeto: Which One Do You Need?",
    description:
      "Copilot Money vs Budgeto: an honest comparison of bank linking, devices, setup time and price, and which one finds forgotten subscriptions faster.",
    search: "copilot money alternative / copilot money vs",
    name: "Copilot Money vs Budgeto",
    og: { top: "Copilot Money vs Budgeto", big: "Track vs find", bottom: "an honest comparison" },
    updated: "2026-11-10",
    section: "compare",
  },
  {
    path: "/for/college-students",
    title: "Subscription Tracker for College Students · Budgeto",
    description:
      "A subscription tracker for college students: drop your bank statement PDF and see every recurring charge, from Spotify to the gym, in seconds.",
    search: "subscription tracker for college students",
    name: "For college students",
    og: { top: "For college students", big: "$0 setup", bottom: "find what renews before rent is due" },
    updated: "2026-11-10",
    section: "for",
  },
  {
    path: "/guides",
    title: "Money Leak Guides: Subscriptions, Fees, Statements",
    description:
      "Plain-English guides to find forgotten subscriptions, stop recurring charges and get bank fees refunded. Real steps, sources cited, no fluff.",
    search: "(hub)",
    name: "Guides",
    og: { top: "Budgeto guides", big: "Stop the leaks", bottom: "subscriptions · recurring charges · bank fees" },
    updated: "2026-11-10",
  },
  {
    path: "/guides/find-forgotten-subscriptions",
    title: "How to Find Subscriptions You Forgot You Pay For",
    description:
      "How to find every subscription you're paying for: the 6 places to check, what statement codes mean, and a 10-minute method that catches yearly renewals.",
    search: "how to find subscriptions i'm paying for",
    name: "How to find forgotten subscriptions",
    og: { top: "Guide", big: "6 places", bottom: "where forgotten subscriptions hide" },
    updated: "2026-11-10",
    section: "guides",
  },
  {
    path: "/guides/stop-recurring-charges",
    title: "How to Stop Recurring Charges on Your Card or Bank",
    description:
      "How to stop a recurring charge for good: cancel with the merchant, revoke it with your bank, stop payment, and dispute it if it comes back. CFPB rules.",
    search: "how to stop recurring charges",
    name: "How to stop recurring charges",
    og: { top: "Guide", big: "4 steps", bottom: "to stop a recurring charge for good" },
    updated: "2026-11-10",
    section: "guides",
  },
  {
    path: "/guides/get-bank-fees-waived",
    title: "How to Get Bank Fees Waived (Word-for-Word Script)",
    description:
      "How to get bank fees waived: a word-for-word phone script for overdraft, monthly service and ATM fees, what to say if they refuse, and how to avoid them.",
    search: "how to get bank fees waived",
    name: "How to get bank fees waived",
    og: { top: "Guide", big: "1 call", bottom: "to get a bank fee refunded" },
    updated: "2026-11-10",
    section: "guides",
  },
];

export function page(path: string): SeoPage {
  const p = PAGES.find((x) => x.path === path);
  if (!p) throw new Error("No SEO entry for " + path);
  return p;
}

/** Title, description, canonical, Open Graph and Twitter card for one public page. */
export function pageMetadata(path: string): Metadata {
  const p = page(path);
  const image = { url: `/og/${ogSlug(path)}`, width: 1200, height: 630, alt: `${p.og.top}: ${p.og.big} ${p.og.bottom}` };
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: path },
    openGraph: { type: path.startsWith("/guides/") ? "article" : "website", siteName: "Budgeto", url: path, title: p.title, description: p.description, images: [image], locale: "en_US" },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [image] },
  };
}

export const ogSlug = (path: string) => (path === "/" ? "home" : path.slice(1).replace(/\//g, "--"));
export const pageFromSlug = (slug: string) => PAGES.find((p) => ogSlug(p.path) === slug) ?? null;

export const fmtDate = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
