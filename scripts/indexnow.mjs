#!/usr/bin/env node
// Sends every URL of the live sitemap.xml to IndexNow (Bing, Yandex, Seznam, Naver… — Bing also feeds ChatGPT search).
// Usage: node scripts/indexnow.mjs [https://site]   (default: NEXT_PUBLIC_SITE_URL or the production URL)
// Runs after each production deploy (npm run deploy, and .github/workflows/indexnow.yml).
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const site = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "https://budgetoo-nine.vercel.app").replace(/\/+$/, "");
const pub = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const keyFile = readdirSync(pub).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("No IndexNow key file (32 hex chars .txt) in public/");
const key = keyFile.replace(/\.txt$/, "");

const live = await fetch(`${site}/${keyFile}`);
if (!live.ok || (await live.text()).trim() !== key) throw new Error(`Key file not live at ${site}/${keyFile} (${live.status})`);

const xml = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urlList.length) throw new Error("sitemap.xml has no <loc> entries");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${keyFile}`, urlList }),
});
console.log(`IndexNow ${res.status} ${res.statusText} — ${urlList.length} URLs:\n  ${urlList.join("\n  ")}`);
const body = await res.text();
if (body) console.log(body);
if (res.status !== 200 && res.status !== 202) process.exit(1);
