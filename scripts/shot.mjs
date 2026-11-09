// Full-page screenshots at 390×844 and 1440×900. Usage: node scripts/shot.mjs /path [name] [--fold]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.env.BASE_URL || "http://localhost:3000";
const path = process.argv[2] || "/";
const name = process.argv[3] || (path.replace(/\W+/g, "_") || "home");
const fold = process.argv.includes("--fold");
mkdirSync("shots", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium" }).catch(() => chromium.launch());
const errors = [];
for (const [w, h, tag] of [[390, 844, "m"], [1440, 900, "d"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`[${tag}] ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`[${tag}] ${e.message}`));
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  if (!fold) {
    // scroll through so reveals fire
    const hgt = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < hgt; y += 600) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(120);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: `shots/${name}-${tag}.png`, fullPage: !fold });
  await ctx.close();
}
await browser.close();
console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "no console errors");
