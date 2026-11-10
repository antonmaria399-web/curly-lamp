import { slideImage } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Subscription cost calculator";

export default function Image() {
  return slideImage({ top: "What do your subscriptions cost?", big: "Per year?", bottom: "free calculator · Budgeto" }, size);
}
