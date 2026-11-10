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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Nobody can frame Budgeto (clickjacking on the checkout/cancel buttons).
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(self \"https://whop.com\" \"https://*.whop.com\")" },
        ],
      },
    ];
  },
};

export default nextConfig;
