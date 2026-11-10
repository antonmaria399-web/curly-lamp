import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ONE_LINER, SITE_URL } from "@/lib/identity";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jbmono", subsets: ["latin"], display: "swap" });


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? SITE_URL : "http://localhost:3000")),
  title: {
    default: "Budgeto — Find the subscriptions you forgot you pay",
    template: "%s · Budgeto",
  },
  description: ONE_LINER,
  applicationName: "Budgeto",
  appleWebApp: { capable: true, title: "Budgeto", statusBarStyle: "black-translucent" },
  openGraph: { type: "website", siteName: "Budgeto", locale: "en_US" },
  twitter: { card: "summary_large_image" },
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
