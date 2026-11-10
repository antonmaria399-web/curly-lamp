import { slideImage } from "@/lib/og";
import { pageFromSlug } from "@/lib/seo/site";

/** Open Graph image of each public page (1200×630), from the lines in lib/seo/site.ts. Unknown slugs 404. */
export async function GET(_req: Request, ctx: RouteContext<"/og/[slug]">) {
  const p = pageFromSlug((await ctx.params).slug);
  if (!p) return new Response("Not found", { status: 404 });
  const img = slideImage(p.og, { width: 1200, height: 630 });
  img.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800");
  return img;
}
