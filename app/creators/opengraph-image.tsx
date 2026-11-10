import { slideImage } from "@/lib/og";
import { creatorRate } from "@/lib/growth";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Get paid to post about Budgeto";

export default function Image() {
  return slideImage({ top: "Get paid to post about Budgeto", big: `$${creatorRate()} / 1K views`, bottom: "paid every Monday · no big audience needed" }, size);
}
