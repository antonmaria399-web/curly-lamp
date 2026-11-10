import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/identity";

/** Every public URL. scripts/indexnow.mjs sends this list to IndexNow after each deploy. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
