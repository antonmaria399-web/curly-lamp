import type { MetadataRoute } from "next";
import { readdirSync } from "node:fs";
import path from "node:path";
import { canonical, isPrivatePath } from "@/lib/seo";
import { AUDIENCES, COMPETITORS } from "@/lib/pages-content";

// Built once per deploy from the app/ folder: every public page.tsx without a [dynamic] segment.
export const dynamic = "force-static";

function routes(dir: string, segs: string[] = []): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && /^page\.(tsx|ts|jsx|js|mdx)$/.test(e.name)) out.push("/" + segs.join("/"));
    if (!e.isDirectory()) continue;
    const n = e.name;
    if (n.startsWith("_") || n.startsWith("@") || n.startsWith("[") || n === "api") continue; // private folders, slots, dynamic, API
    const inGroup = n.startsWith("(") && n.endsWith(")");
    out.push(...routes(path.join(dir, n), inGroup ? segs : [...segs, n]));
  }
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // [dynamic] pages with a known list of slugs: one page per audience and per competitor.
  const seo = [...AUDIENCES.map((a) => `/for/${a.slug}`), ...COMPETITORS.map((c) => `/vs/${c.slug}`)];
  const paths = [...new Set([...routes(path.join(process.cwd(), "app")), ...seo])]
    .filter((p) => !isPrivatePath(p))
    .sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
  return paths.map((p) => ({
    url: canonical(p),
    changeFrequency: p === "/" ? "weekly" : "monthly",
    priority: p === "/" ? 1 : 0.5,
  }));
}
