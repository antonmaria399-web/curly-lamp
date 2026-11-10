import type { MetadataRoute } from "next";
import { AUDIENCES, COMPETITORS } from "@/lib/seo";
import { siteUrl } from "@/lib/growth";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tools/subscription-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...AUDIENCES.map((a) => ({ url: `${base}/for/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...COMPETITORS.map((c) => ({ url: `${base}/vs/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${base}/creators`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
