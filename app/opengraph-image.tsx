import { slideImage } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Budgeto: your leak report in 5 seconds";

export default function Image() {
  return slideImage({ top: "I found a forgotten subscription", big: "$211.86/mo", bottom: "in 5 seconds · example leak report" }, size);
}
