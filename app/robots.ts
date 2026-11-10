import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Crawl everything but the API. Private screens (app, auth, shared reports) stay crawlable on purpose so Google
 * can see their noindex (proxy.ts X-Robots-Tag + meta): a robots.txt block would hide the noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: SITE_URL + "/sitemap.xml",
  };
}
