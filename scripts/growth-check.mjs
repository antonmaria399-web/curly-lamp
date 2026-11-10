import { chromium } from "playwright";
const base = "http://localhost:3000";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const out = [];
const log = (...a) => { out.push(a.join(" ")); console.log(...a); };
const errs = [];
async function ctx(w = 390, h = 844) {
  const c = await browser.newContext({ viewport: { width: w, height: h } });
  const p = await c.newPage();
  p.on("pageerror", (e) => errs.push(p.url() + " " + e.message));
  p.on("console", (m) => m.type() === "error" && !/kwop\.io|Failed to load resource|whop/.test(m.text()) && errs.push(p.url() + " " + m.text()));
  return { c, p };
}
async function login(p, email) {
  await p.goto(base + "/login");
  await p.getByPlaceholder("Email").fill(email);
  await p.getByPlaceholder("Password").fill("Leaks-are-bad-2026");
  await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForURL("**/dashboard");
}

// 1. /admin: anonymous and non-owner get 404, owner gets in.
{
  const { c, p } = await ctx();
  let r = await p.goto(base + "/admin");
  log("admin anon", r.status());
  await login(p, "power@budgeto-test.dev");
  r = await p.goto(base + "/admin");
  log("admin power", r.status());
  const api = await p.request.post(base + "/api/admin", { data: { action: "status", id: "00000000-0000-0000-0000-000000000000", status: "active" } });
  log("admin api power", api.status());
  await c.close();
}

// 2. Creator application (public).
{
  const { c, p } = await ctx();
  await p.goto(base + "/creators");
  await p.locator('input[name="name"]').fill("Jamie Test");
  await p.locator('input[name="email"]').fill("jamie@budgeto-test.dev");
  await p.locator('input[name="handle"]').fill("@jamiesaves");
  await p.locator('input[name="avg_views"]').fill("1200");
  await p.locator('input[name="country"]').fill("United States");
  await p.getByRole("button", { name: "Send my application" }).click();
  await p.getByText("Application sent.").waitFor({ timeout: 10000 });
  log("creator apply ok");
  await c.close();
}

// 3. Owner: admin tabs, accept creator, save ref, add payout.
{
  const { c, p } = await ctx();
  await login(p, "antonmaria399@gmail.com");
  for (const t of ["numbers", "creators", "scripts", "messages"]) {
    const r = await p.goto(base + "/admin?tab=" + t);
    await p.waitForTimeout(800);
    await p.screenshot({ path: `shots/admin-${t}.png`, fullPage: true });
    log("admin", t, r.status());
  }
  await p.goto(base + "/admin?tab=creators");
  await p.getByRole("button", { name: "accepted" }).first().click();
  await p.waitForTimeout(1500);
  await p.getByPlaceholder("their Kwop link code").first().fill("jamie1");
  await p.getByRole("button", { name: "Save link" }).first().click();
  await p.waitForTimeout(1500);
  await p.getByPlaceholder("Views").fill("45000");
  await p.getByRole("button", { name: /^Add/ }).click();
  await p.waitForTimeout(1500);
  const total = await p.getByText("Total to pay").locator("..").innerText();
  log("payout", total.replace(/\n/g, " "));
  await p.screenshot({ path: `shots/admin-creators-after.png`, fullPage: true });
  await c.close();
}

// 4. Invite: power's code → new visitor signs up with it → both rewarded.
let code;
{
  const { c, p } = await ctx();
  await login(p, "power@budgeto-test.dev");
  const j = await (await p.request.get(base + "/api/invite")).json();
  code = j.code;
  log("invite code", code, "bonus before", j.bonus);
  await c.close();
}
{
  const { c, p } = await ctx(1440, 900);
  await p.goto(base + "/i/" + code);
  log("after invite link", p.url());
  const banner = await p.getByText("A friend invited you").count();
  log("invite banner", banner);
  await p.getByRole("button", { name: "Try a sample statement" }).click();
  await p.getByRole("button", { name: "See my full leak report" }).first().waitFor({ timeout: 60000 });
  await p.getByRole("button", { name: "See my full leak report" }).first().click();
  const email = `friend+${Date.now()}@budgeto-test.dev`;
  await p.getByPlaceholder("Email").fill(email);
  await p.getByPlaceholder("Password").fill("Leaks-are-bad-2026");
  await p.getByRole("button", { name: /Create my account|Sign up|Save my leak report|Continue/ }).last().click();
  await p.getByText("Choose your plan.").waitFor({ timeout: 20000 });
  log("paywall opened after signup");
  // First ✕ → yearly offer.
  await p.getByRole("button", { name: /close/i }).first().click();
  const offer = p.getByText("One-time offer");
  await offer.waitFor({ timeout: 8000 }).then(() => log("offer shown")).catch(() => log("offer NOT shown"));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: "shots/offer-d.png" });
  await p.getByRole("button", { name: "No thanks" }).click();
  await p.waitForTimeout(800);
  // Second open + ✕ → no offer again.
  await p.getByRole("button", { name: "See my full leak report" }).first().click();
  await p.getByText("Choose your plan.").waitFor({ timeout: 8000 });
  await p.getByRole("button", { name: /close/i }).first().click();
  await p.waitForTimeout(1500);
  log("offer second time visible:", await p.getByText("One-time offer").isVisible().catch(() => false));
  const j = await (await p.request.get(base + "/api/invite")).json();
  log("friend bonus", j.bonus);
  await c.close();
}
{
  const { c, p } = await ctx();
  await login(p, "power@budgeto-test.dev");
  const j = await (await p.request.get(base + "/api/invite")).json();
  log("inviter after: friends", j.friends, "bonus", j.bonus);
  // 5. Cancel with a reason (stop before the final cancel).
  await p.goto(base + "/account");
  await p.getByRole("button", { name: "Cancel my subscription" }).click();
  await p.getByRole("button", { name: "It's too expensive" }).click();
  await p.waitForTimeout(800);
  await p.screenshot({ path: "shots/cancel-why.png", fullPage: true });
  const txt = await p.locator("#billing").innerText();
  log("cancel answer:", txt.includes("/day") ? "per-day shown" : txt.slice(0, 200));
  await p.getByRole("button", { name: "Keep my plan" }).click();
  await c.close();
}
log("errors:", errs.length ? errs.join("\n") : "none");
await browser.close();
