import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/identity";

/** AI answer engines and search crawlers are welcome on the public pages. */
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Applebot", "Bingbot", "Googlebot"];
const PRIVATE = ["/api/", "/dashboard", "/upload", "/leaks", "/settings", "/account", "/reports", "/export", "/pricing", "/auth/", "/reset", "/s/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_BOTS, allow: "/", disallow: PRIVATE },
      { userAgent: "*", allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
