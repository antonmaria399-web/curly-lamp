// Logs in as a test user and screenshots every app page. Usage: node scripts/app-shots.mjs email w h [scan]
import { chromium } from "playwright";
const [email, w = "390", h = "844", scan] = process.argv.slice(2);
const base = process.env.BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: +w, height: +h } })).newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
page.on("console", (m) => m.type() === "error" && !/kwop\.io|Failed to load resource/.test(m.text()) && errs.push(page.url() + " " + m.text()));
await page.goto(base + "/login");
await page.getByPlaceholder("Email").fill(email);
await page.getByPlaceholder("Password").fill("Leaks-are-bad-2026");
await page.getByRole("button", { name: "Log in" }).click();
await page.waitForURL("**/dashboard");
const tag = email.split("@")[0] + "-" + w;
if (scan) {
  for (let i = 0; i < Number(scan); i++) {
    await page.goto(base + "/upload");
    await page.getByRole("button", { name: "Try a sample statement" }).click();
    await page.getByText("Open in my account").waitFor({ timeout: 60000 });
  }
  await page.screenshot({ path: `shots/a-${tag}-upload-done.png`, fullPage: true });
}
for (const p of ["/dashboard", "/upload", "/leaks", "/settings", "/account"]) {
  await page.goto(base + p);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `shots/a-${tag}${p.replace("/", "-")}.png`, fullPage: true });
}
await page.goto(base + "/upload");
const link = page.locator('a[href^="/reports/"]').first();
if (await link.count()) {
  await link.click();
  await page.waitForURL("**/reports/**");
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `shots/a-${tag}-report.png`, fullPage: true });
  const id = page.url().split("/reports/")[1];
  await page.goto(base + "/export/" + id);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `shots/a-${tag}-export.png`, fullPage: true });
}
console.log(errs.length ? errs.join("\n") : "no errors");
await browser.close();
