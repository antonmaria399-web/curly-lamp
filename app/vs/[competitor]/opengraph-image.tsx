import { slideImage } from "@/lib/og";
import { COMPETITORS } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Budgeto comparison";
export function generateStaticParams() {
  return COMPETITORS.map((c) => ({ competitor: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ competitor: string }> }) {
  const slug = (await params).competitor;
  const c = COMPETITORS.find((x) => x.slug === slug) ?? COMPETITORS[0];
  return slideImage({ top: `Budgeto vs ${c.name}`, big: "No bank login", bottom: "an honest comparison" }, size);
}
