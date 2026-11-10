import { test, expect, type Page } from "@playwright/test";

// A phone screenshot of each funnel screen, for the visual check (shots/ is gitignored).
const shot = (page: Page, name: string) => page.waitForTimeout(1500).then(() => page.screenshot({ path: `shots/e2e-${name}.png` }));

// Stands in for Whop's embed script: mounts a fake checkout and reports a payment, like Whop's onComplete.
const FAKE_WHOP = `window.WhopElements = function () { return { checkout: { create: function (o) {
  return { create: function () { return { mount: function (sel) {
    var f = document.createElement('iframe'); document.querySelector(sel).appendChild(f);
    o.onLoadingChange && o.onLoadingChange({ loading: false });
    setTimeout(function () { o.onComplete && o.onComplete({ result: 'payment' }); }, 800);
  } }; }, destroy: function () {} };
} } }; };`;

async function scanSample(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Find the subscriptions you forgot you pay");
  await page.getByRole("button", { name: /Try a sample statement/ }).click();
  await expect(page.getByText("Your leak report is ready.").first()).toBeVisible({ timeout: 45_000 });
}

async function signUp(page: Page, email: string) {
  await page.getByRole("button", { name: "See my full leak report" }).first().click();
  const sheet = page.getByRole("dialog", { name: "Save your leak report" });
  await expect(sheet).toBeVisible();
  await sheet.getByPlaceholder("Email").fill(email);
  await sheet.getByPlaceholder(/Create a password/).fill("correct-horse-battery");
  await sheet.locator('button[type="submit"]').click();
}

test("landing → sample scan → locked → sign-up → paywall → checkout → unlocked → account", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.route("https://cdn.whop.com/**", (r) => r.fulfill({ contentType: "application/javascript", body: FAKE_WHOP }));

  // The scan response must be locked server-side: leak #1 only, never the totals.
  const scan = page.waitForResponse((r) => r.url().endsWith("/api/scan"));
  await scanSample(page);
  const body = await (await scan).json();
  expect(body.result.locked).toBe(true);
  expect(body.result.first_leak?.merchant).toBeTruthy();
  expect(JSON.stringify(body.result)).not.toMatch(/monthly_total|yearly_total|"leaks":/);
  await expect(page.getByText(body.result.first_leak.merchant).first()).toBeVisible();
  await shot(page, "1-locked");

  await signUp(page, `e2e-${Date.now()}@example.com`);

  // Paywall over the blurred report, with the personal line.
  const paywall = page.getByRole("dialog", { name: "Choose your plan" });
  await expect(paywall).toBeVisible({ timeout: 20_000 });
  await expect(paywall.getByText(/We found \d+ recurring charges in Sample Community Bank/)).toBeVisible();
  await shot(page, "2-paywall");
  await paywall.getByRole("button", { name: /^Continue with / }).first().click();

  // Checkout sheet inside the page → payment → unlock film.
  await expect(page.getByRole("dialog", { name: "Checkout" })).toBeVisible();
  await expect(page.getByText(/You.re on /)).toBeVisible({ timeout: 20_000 });
  await shot(page, "3-unlock-film");
  await page.getByRole("button", { name: "Skip" }).click();

  // The report is unblurred: the real total is shown.
  await expect(page.getByText("$0,000.00")).toHaveCount(0);
  await expect(page.getByText(/a year you could keep/).first()).toBeVisible({ timeout: 15_000 });
  await shot(page, "4-unlocked");

  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
  await expect(page.getByText(/\[ Current plan \]\s*Pro\s*Renews on/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel my subscription" })).toBeVisible();

  // A Pro user on /pricing is offered the next plan only (Power), not told "all set".
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "You're on Pro" })).toBeVisible();
  await expect(page.getByRole("dialog", { name: "Upgrade" }).getByText(/Power/).first()).toBeVisible();
  await shot(page, "6-upgrade");

  expect(errors.filter((e) => !/favicon|kwop\.io\/flow/.test(e))).toEqual([]);
});

test("payments not connected yet → honest message, report kept", async ({ page }) => {
  await scanSample(page);
  await signUp(page, `off-${Date.now()}@example.com`);
  const paywall = page.getByRole("dialog", { name: "Choose your plan" });
  await expect(paywall).toBeVisible({ timeout: 20_000 });
  await paywall.getByRole("button", { name: /^Continue with / }).first().click();
  await expect(page.getByText("Payments open in a moment. Your leak report is saved.")).toBeVisible();
  await shot(page, "5-payments-off");
});
