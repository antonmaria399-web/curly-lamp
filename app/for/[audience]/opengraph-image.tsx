import { slideImage } from "@/lib/og";
import { AUDIENCES } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Budgeto: an example leak report";
export function generateStaticParams() {
  return AUDIENCES.map((a) => ({ audience: a.slug }));
}

const monthly = (amount: number, cadence: string) => (cadence === "weekly" ? (amount * 52) / 12 : cadence === "yearly" ? amount / 12 : amount);

export default async function Image({ params }: { params: Promise<{ audience: string }> }) {
  const slug = (await params).audience;
  const a = AUDIENCES.find((x) => x.slug === slug) ?? AUDIENCES[0];
  const total = a.example.reduce((s, e) => s + monthly(e.amount, e.cadence), 0);
  return slideImage({ top: `${a.h1} Example leak report:`, big: `$${total.toFixed(2)}/mo`, bottom: "found in seconds · no bank login" }, size);
}
