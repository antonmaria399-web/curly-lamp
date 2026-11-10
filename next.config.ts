import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["unpdf"],
  poweredByHeader: false,
  outputFileTracingIncludes: { "/api/scan": ["./public/sample-statement.pdf"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // One canonical domain: on production, every other host (budgetoo-bufgeto.vercel.app, deployment URLs…)
  // redirects to it. http → https is done by Vercel.
  async redirects() {
    const canonical = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host : null;
    if (process.env.VERCEL_ENV !== "production" || !canonical) return [];
    return [
      {
        source: "/:path*",
        missing: [{ type: "host", value: canonical }],
        destination: `https://${canonical}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(self \"https://whop.com\" \"https://*.whop.com\")" },
        ],
      },
    ];
  },
};

export default nextConfig;
