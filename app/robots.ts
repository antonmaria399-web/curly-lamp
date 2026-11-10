import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/growth";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/dashboard", "/upload", "/leaks", "/settings", "/account", "/reports", "/export", "/pricing", "/s/", "/i/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
