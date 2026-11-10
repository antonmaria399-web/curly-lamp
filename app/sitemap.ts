import type { MetadataRoute } from "next";
import { PAGES, abs } from "@/lib/seo/site";

/** Public pages only. App screens, auth screens, shared reports and the API are never listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((p) => ({
      url: abs(p.path),
      lastModified: new Date(p.updated + "T12:00:00Z"),
      changeFrequency: (p.path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: p.path === "/" ? 1 : p.section === "guides" ? 0.7 : 0.8,
    })),
    { url: abs("/privacy"), lastModified: new Date("2026-11-08T12:00:00Z"), changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/terms"), lastModified: new Date("2026-11-08T12:00:00Z"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
