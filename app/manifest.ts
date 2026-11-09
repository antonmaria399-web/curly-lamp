import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Budgeto",
    short_name: "Budgeto",
    description: "Find the subscriptions you forgot you pay.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#060606",
    theme_color: "#060606",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
