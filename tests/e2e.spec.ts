import { test, expect } from "@playwright/test";

/** The blueprint's whole funnel, as a brand-new visitor. Never pays. */
test("landing → sample scan → locked → sign-up → paywall → checkout sheet → account", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/whop|kwop\.io|Failed to load resource/i.test(m.text())) errors.push(m.text());
  });

  // In the build sandbox Whop's CDN is not reachable: WHOP_STUB=1 serves a stand-in for its script (same API).
  if (process.env.WHOP_STUB === "1") {
    await page.route("https://cdn.whop.com/**", (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: `window.WhopElements=function(){return{checkout:{create:function(o){var el;return{create:function(){return{mount:function(sel){el=document.querySelector(sel);var f=document.createElement('iframe');f.title='Whop checkout';f.style.cssText='width:100%;height:420px;border:0';f.srcdoc='<p style="font-family:sans-serif">Whop checkout (stub)</p>';el.appendChild(f);setTimeout(function(){o.onLoadingChange&&o.onLoadingChange({loading:false})},300)}}},destroy:function(){if(el)el.innerHTML=''}}}}}};`,
      }),
    );
  }

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Find the subscriptions you forgot you pay");
  // No prices on the landing page, except the GEO FAQ answer "How much does it cost?" (owner's request, Nov 10).
  const outsideFaq = await page.locator("main > section:not(#faq)").allInnerTexts();
  expect(outsideFaq.join("\n")).not.toMatch(/\$\d+(\.\d\d)?\s*\/\s*(mo|month|day)\b.*plan/i);
  await expect(page.locator("#faq")).toContainText("How much does it cost?");

  await page.getByRole("button", { name: "Try a sample statement" }).click();
  await expect(page.getByText("Scanning your statement…")).toBeVisible();
  await expect(page.getByRole("button", { name: "See my full leak report" }).last()).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Smartsafe Self Storage").first()).toBeVisible();
  await expect(page.getByText("Locked")).toBeVisible();

  await page.getByRole("button", { name: "See my full leak report" }).last().click();
  const signup = page.getByRole("dialog", { name: "Save your leak report" });
  await expect(signup).toBeVisible();
  const email = `e2e+${Date.now()}${Math.floor(Math.random() * 1000)}@budgeto-test.dev`;
  await signup.getByPlaceholder("Email").fill(email);
  await signup.getByPlaceholder(/Create a password/).fill("Leaks-are-bad-2026");
  await signup.getByRole("button", { name: "Create my account" }).click();

  const paywall = page.getByRole("dialog", { name: "Choose your plan" });
  await expect(paywall.getByText("Your leak report is ready.")).toBeVisible();
  await expect(paywall.getByText("Choose your plan.")).toBeVisible();
  await expect(paywall.getByText("Most popular").first()).toBeVisible();
  await expect(paywall.getByText("/ day").first()).toBeVisible();
  const cont = paywall.getByRole("button", { name: /^Continue with / }).first();
  await expect(cont).toBeVisible();
  await cont.click();

  const checkout = page.getByRole("dialog", { name: "Checkout" });
  await expect(checkout.getByText("[ Checkout ]")).toBeVisible();
  await expect(checkout.locator("iframe").or(checkout.getByText("Payments open in a moment")).first()).toBeVisible();
  await checkout.getByRole("button", { name: "Close" }).click();
  await expect(checkout).toBeHidden();
  await expect(paywall).toBeVisible();
  await paywall.getByRole("button", { name: "Close" }).click();
  await expect(paywall).toBeHidden();
  await expect(page.getByText("Smartsafe Self Storage").first()).toBeVisible();

  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
  await expect(page.locator(`input[value="${email}"]`)).toBeVisible();

  // The report waits for them in the app, still locked.
  await page.goto("/dashboard");
  await expect(page.getByText("Your leak report").first()).toBeVisible();
  await expect(page.getByText("Smartsafe Self Storage").first()).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});
