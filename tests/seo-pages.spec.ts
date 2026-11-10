import { test, expect } from "@playwright/test";

/** Every SEO page carries the real product: the sample scan runs in place, without leaving the page. */
test("SEO page → sample scan → locked leak report", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/rocket-money-alternative");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Rocket Money alternative");
  await page.getByRole("button", { name: "Try a sample statement" }).click();
  await expect(page.getByRole("button", { name: "See my full leak report" }).last()).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Smartsafe Self Storage").first()).toBeVisible();
  expect(errors).toEqual([]);
});
