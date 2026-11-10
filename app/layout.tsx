import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jbmono", subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Budgeto — Find the subscriptions you forgot you pay",
    template: "%s · Budgeto",
  },
  description:
    "Drop your bank statement PDF. Budgeto's AI flags forgotten subscriptions and hidden fees in seconds. No bank login, no manual entry.",
  applicationName: "Budgeto",
  appleWebApp: { capable: true, title: "Budgeto", statusBarStyle: "black-translucent" },
  openGraph: { type: "website", siteName: "Budgeto" },
  twitter: { card: "summary_large_image" },
  // Google Search Console ownership (URL-prefix property https://budgetoo-nine.vercel.app/). Keep it.
  verification: { google: "-D80IxMd5HcAc_IliP86nRLS5flb-01nNoFAlx5wjiQ" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#060606" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeScript = `try{var t=localStorage.getItem('budgeto-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
