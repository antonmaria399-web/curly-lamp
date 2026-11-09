import type { Metadata } from "next";
import { PricingClient } from "@/components/app/pricing-client";

export const metadata: Metadata = { title: "Plans" };

/** The same paywall as a page, for logged-in users (checkout pages send people back here when they cancel). Never linked from the landing page. */
export default function PricingPage() {
  return <PricingClient />;
}
