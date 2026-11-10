/**
 * Search-engine rules, in one place (used by proxy.ts, app/sitemap.ts, app/robots.ts and page metadata).
 * Public = every page.tsx outside these prefixes and without a [dynamic] segment — a new public page
 * lands in sitemap.xml by itself. Private = noindex (X-Robots-Tag) and never in the sitemap.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://budgetoo-nine.vercel.app").replace(/\/+$/, "");
export const SITE_HOST = new URL(SITE_URL).host;

export const PRIVATE_PREFIXES = [
  // sign-in
  "/login", "/signup", "/forgot", "/reset", "/auth",
  // the app itself, account, checkout (pricing = in-app plans/checkout)
  "/dashboard", "/upload", "/leaks", "/settings", "/account", "/reports", "/export", "/pricing",
  // admin (none today; reserved), API, shared personal results
  "/admin", "/api", "/s",
];

export function isPrivatePath(path: string) {
  return PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

/** Absolute canonical URL for a path ("/" → "https://host/"). */
export function canonical(path: string) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}
