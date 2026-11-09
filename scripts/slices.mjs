// Viewport-sized slices of a page, for reviewing. Usage: node scripts/slices.mjs /path name [w] [h]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const [path = "/", name = "page", w = "390", h = "844"] = process.argv.slice(2);
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }).catch(() => chromium.launch());
const page = await (await browser.newContext({ viewport: { width: +w, height: +h }, reducedMotion: "reduce" })).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await page.goto((process.env.BASE_URL || "http://localhost:3000") + path, { waitUntil: "networkidle" });
const H = await page.evaluate(() => document.body.scrollHeight);
let i = 0;
for (let y = 0; y < H; y += +h) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `shots/${name}-${w}-${String(i++).padStart(2, "0")}.png` });
}
console.log("slices", i, errs.length ? errs.join("\n") : "no errors");
await browser.close();
