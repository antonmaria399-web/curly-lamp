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
  // No prices on the landing page.
  await expect(page.locator("body")).not.toContainText(/\$\d+(\.\d\d)?\s*\/\s*(mo|month|day)\b.*plan/i);

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
  // First ✕: one honest offer (yearly, real 30-minute window), once. Second ✕: the locked report.
  const offer = page.getByRole("dialog", { name: "Yearly offer" });
  await expect(offer.getByText("[ Before you go ]")).toBeVisible();
  await expect(offer.getByText(/stays open for 2\d:\d\d|stays open for 30:00/)).toBeVisible();
  await offer.getByRole("button", { name: "Close" }).click();
  await expect(offer).toBeHidden();
  await expect(page.getByText("Smartsafe Self Storage").first()).toBeVisible();

  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Account" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email" })).toHaveValue(email);
  await expect(page.getByText(/Invite a friend, you both get \d+ extra scans/)).toBeVisible();

  // The report waits for them in the app, still locked.
  await page.goto("/dashboard");
  await expect(page.getByText("Your leak report").first()).toBeVisible();
  await expect(page.getByText("Smartsafe Self Storage").first()).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

/** A friend arriving from an invite link: both get extra scans, counted on the server. */
test("invite link → friend signs up → both rewarded · creators form · admin hidden", async ({ page, browser }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const pw = "Leaks-are-bad-2026";
  const mk = () => `e2e+${Date.now()}${Math.floor(Math.random() * 1000)}@budgeto-test.dev`;

  // Inviter: sign up on /signup, read their invite link.
  const inviter = mk();
  await page.goto("/signup");
  await page.getByPlaceholder("Email").fill(inviter);
  await page.getByPlaceholder(/Create a password/).fill(pw);
  await page.getByRole("button", { name: "Create my account" }).click();
  await page.waitForURL(/\/(dashboard|upload)/);
  const inv = await page.evaluate(() => fetch("/api/invite").then((r) => r.json()));
  expect(inv.code).toMatch(/^[a-z0-9]{7}$/);
  expect(inv.friends).toBe(0);

  // Friend, in a fresh browser: the invite link lands on the live product with a banner.
  const ctx = await browser.newContext({ viewport: page.viewportSize() ?? undefined });
  const friend = await ctx.newPage();
  await friend.goto(`/i/${inv.code}`);
  await expect(friend.getByText(/A friend invited you/)).toBeVisible();
  await friend.getByRole("button", { name: "Try a sample statement" }).click();
  await expect(friend.getByRole("button", { name: "See my full leak report" }).last()).toBeVisible({ timeout: 60_000 });
  await friend.getByRole("button", { name: "See my full leak report" }).last().click();
  const signup = friend.getByRole("dialog", { name: "Save your leak report" });
  await signup.getByPlaceholder("Email").fill(mk());
  await signup.getByPlaceholder(/Create a password/).fill(pw);
  await signup.getByRole("button", { name: "Create my account" }).click();
  await expect(friend.getByRole("dialog", { name: "Choose your plan" }).getByText("Your leak report is ready.")).toBeVisible();
  const mine = await friend.evaluate(() => fetch("/api/invite").then((r) => r.json()));
  expect(mine.earned).toBe(mine.reward.welcome);
  await ctx.close();

  const after = await page.evaluate(() => fetch("/api/invite").then((r) => r.json()));
  expect(after.friends).toBe(1);
  expect(after.left).toBe(after.reward.signup);

  // Creators: public page, application form works.
  await page.goto("/creators");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Get paid to post");
  await page.getByPlaceholder("Jordan").fill("E2E Tester");
  await page.getByPlaceholder("you@email.com").fill(mk());
  await page.getByPlaceholder("@yourhandle").fill("@e2e_budgeto_test");
  await page.getByPlaceholder("500").fill("800");
  await page.getByPlaceholder("United States").fill("United States");
  await page.getByRole("button", { name: "Apply to post" }).click();
  // Saved, or (on repeat runs from the same IP) the 3-a-day limit answers kindly.
  await expect(page.getByText(/Application sent\.|We already got your application today/)).toBeVisible();

  // /admin: only the owner gets in.
  const r = await page.goto("/admin");
  expect(r?.status()).toBe(404);

  expect(errors, errors.join("\n")).toEqual([]);
});
