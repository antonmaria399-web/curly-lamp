// IndexNow after each deploy: sends every URL in the live sitemap to api.indexnow.org (Bing → ChatGPT search).
// Usage: node scripts/indexnow.mjs [https://site]
// If this machine cannot reach api.indexnow.org (sandbox), it asks the live site to send it instead
// (POST /api/indexnow with INDEXNOW_SECRET from the env or .env.production.local).
import { readFileSync, existsSync } from "node:fs";

const site = (process.argv[2] || process.env.SITE_URL || "https://budgetoo-nine.vercel.app").replace(/\/+$/, "");
const key = readFileSync(new URL("../lib/indexnow.ts", import.meta.url), "utf8").match(/INDEXNOW_KEY = "([^"]+)"/)[1];

const sm = await (await fetch(`${site}/sitemap.xml`, { cache: "no-store" })).text();
const urlList = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("No URLs in sitemap");
const k = await fetch(`${site}/${key}.txt`);
if (!k.ok || (await k.text()).trim() !== key) throw new Error(`Key file ${site}/${key}.txt is not live yet`);
console.log(`IndexNow: ${urlList.length} URLs from ${site}/sitemap.xml`);

try {
  const r = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList }),
  });
  console.log(`api.indexnow.org → ${r.status} ${r.statusText} (200/202 = accepted)`);
  if (r.status >= 300) process.exit(1);
} catch (e) {
  console.log(`api.indexnow.org unreachable from here (${e.cause?.code || e.message}); asking ${site} to send it`);
  let secret = process.env.INDEXNOW_SECRET;
  if (!secret && existsSync(".env.production.local")) secret = readFileSync(".env.production.local", "utf8").match(/^INDEXNOW_SECRET=(.*)$/m)?.[1]?.replace(/^"|"$/g, "");
  if (!secret) throw new Error("INDEXNOW_SECRET missing");
  const r = await fetch(`${site}/api/indexnow`, { method: "POST", headers: { Authorization: `Bearer ${secret}` } });
  const j = await r.json().catch(() => ({}));
  console.log(`via ${site}/api/indexnow → IndexNow answered ${j.status ?? r.status}`);
  if (!r.ok) process.exit(1);
}
