import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Private pages are NOT disallowed here on purpose: crawlers must be able to fetch them to see their
// noindex (X-Robots-Tag from proxy.ts). Only the API is off-limits.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
