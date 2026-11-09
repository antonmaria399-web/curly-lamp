# Budgeto — project memory

> Stop wondering where your paycheck went.
> Upload a PDF bank statement → AI finds your money leaks (forgotten subscriptions, recurring fees) → you cancel them and track the savings.

The full owner brief (method, rules, Kwop API, build order) is in `docs/BUILD-SPEC.md` (key redacted; the real key lives only in `.env.local` / Vercel as `KWOP_API`). Read it before changing the funnel. Rules there are **literal**: no prices on the landing page, value before price, paywall at the peak, checkout inside the page, honest copy, phones first.

## RESULT
**RESULT = "your leak report"** (short: "leak report").
- Main button everywhere: **"Find my leaks"** (+ arrow).
- Creating screen: "Scanning your statement…" → "Your leak report is ready."
- Paywall title: **"Your leak report is ready."** Personal line: "We found {n} recurring charges in {bank or 'your statement'} — {first leak} is just one of them."
- Unlock button: **"See my full leak report"**.
- Notifications/emails: "Your leak report is ready", "New leak spotted".

## Step 0 — what already converts (market study, Nov 2026)
YNAB and Copilot are budgeting apps that connect to bank accounts; neither scans a PDF statement nor is built around "find the forgotten subscription". **Copilot kept for price reference only; Rocket Money replaces it as the job-match competitor** (its core hook is finding and cancelling subscriptions).

| | YNAB | Copilot Money | Rocket Money |
|---|---|---|---|
| Hero headline | "Stop living paycheck to paycheck" style: a method promise ("give every dollar a job") | "The smartest way to track your money" — design-led, product screenshot | "Take control of your financial life" — subscriptions + savings |
| Sections (order) | Hero → method (4 rules) → testimonials → features → education/workshops → pricing → FAQ | Hero → app screenshots per feature (budgets, categories, investments) → reviews/press → pricing → FAQ | Hero → "cancel subscriptions" → budgets → bill negotiation → credit score → reviews → CTA |
| Button words | "Start your free trial" | "Download" / "Start free trial" | "Get started" / app-store badges |
| Sign-up | Email (+ Google/Apple), no card | App Store / web, card for trial | Email or Google, then bank link (Plaid) |
| Steps to first result | Sign up → link bank or manual accounts → assign dollars (minutes–days) | Download → card trial → link bank → categories fill in | Sign up → link bank via Plaid → subscriptions list appears |
| Paywall | Trial ends after 34 days | Before use (trial needs card) | After first subscription list: "Premium" upsell to cancel for you |
| Plans | $14.99/mo or $109/yr, 34-day trial | $13/mo or $95/yr, 30-day trial | Free + Premium "pay what you want" ~$6–$14/mo; Premium+ ~$15/mo |

**Model picked: Rocket Money** (structure and flow: value = the list of your subscriptions, then upsell), with Kwop rules on top: no bank link needed (PDF upload, zero manual entry, no Plaid), result in seconds on the landing page, paywall over their own blurred report, no prices on the landing page. Nothing copied (brand, text, images, code).

Our edge to say on the page: no bank login required, works with the PDF you already have, 5 seconds instead of a weekend of setup.

## Step 0b — Blueprint

### Funnel: TRY FIRST (and why)
The upload IS the product: a PDF can be analysed with no account in ~5–15 s. Every competitor asks for a bank login first; Budgeto shows the money first.

### Hero (first 10 seconds)
- Dark hero, dot grid, soft lime glow. Mono label `[ AI STATEMENT SCAN ]`.
- Title (≤ 8 words): **"Find the subscriptions you forgot you pay."** second line in gradient: "In 5 seconds."
- Sub: "Drop your bank statement PDF. Budgeto's AI flags **recurring charges** and **hidden fees** — no bank login."
- **Drop zone** (big, dashed, lime on hover): "Drop your statement PDF" / "or tap to choose a file" (on phones `accept="application/pdf,image/*"` so camera/photos also work). Under it: **"Try a sample statement →"** (one tap, a real bundled sample PDF processed by the same real engine).
- Fact line (mono): "Free to try · No bank login · No card · Ready in seconds".
- Privacy line: "Your file is read once, never sold. Delete it anytime."

### Funnel screens (in place, never leaving the page)
1. **Scanning** (≥ 3 s, real Gemini call): the statement page in a scan frame with a lime line sweeping down, transaction rows lighting up, a progress ring 0→99 %. Steps tick: "Reading your statement" → "Finding transactions" → "Spotting recurring charges" → "Checking for hidden fees" → "Adding up your leaks". Hold at 99 % until done. Fail → retry once → "We couldn't read this file. Try again" (+ try sample).
2. **Teaser / RESULT locked**: "Your leak report is ready." with success tick.
   - CLEAR: the file name + bank/period, transactions count, and **leak #1** (merchant, amount, cadence, why it's flagged).
   - BLURRED: the big total **"$___ / month in leaks"** (+ yearly), leaks #2…n, category breakdown, the hidden-fee list.
   - Button: **"See my full leak report"**.
3. **Sign-up sheet** (no account): title **"Save your leak report"**, "Continue with Google", or email + password.
4. **Paywall sheet** right away over the blurred report: "Your leak report is ready." + personal line.
5. **Checkout sheet** inside the page (Whop embed via Kwop).
6. **Unlock film** (3 scenes) → report unblurs in place.

### Plans (filled after the owner picks prices — see "Plans & quotas")
Units: statement scans a month, leaks tracked, months of history, exports, comparisons over time.

### Magic moment on the landing page
The live product itself (try-first drop zone) + under it a device frame showing a finished leak report with a phone notification "Budgeto · Leak found: Hulu $17.99/mo — not used in 94 days" (example values, labelled as an example).

### Visual direction (trust and precision)
- Ink `#0A0B0A` text / near-black backgrounds `#060606`; paper `#FAFAFA` light sections; white cards `#FFFFFF`.
- Brand/accent **lime `#C8FF3D`** (buttons, scan line, focus) — on light backgrounds lime is used as a fill with ink text, never as text.
- Gains green `#16A34A` (light) / `#4ADE80` (dark); losses red `#E11D48` (light) / `#FB7185` (dark).
- Greys: `#71717A` muted, borders `rgba(10,11,10,.08)` light / `rgba(255,255,255,.09)` dark.
- Fonts: **Inter** (UI, titles, -0.04em on big titles) + **JetBrains Mono** (every amount, tabular figures, labels in `[ BRACKETS ]`).
- Signature elements: (1) **the scan frame** — a statement page with a sweeping lime scan line and rows lighting up; (2) **the leak meter** — a big tabular counter "$214.37 / mo" that counts up, with a red down-arrow; (3) **ledger rows** — merchant · dotted leader · amount, with a recurring "↻ monthly" chip and a "last used" dot.

## Plans & quotas
(owner's pick goes here — step 0c)

## Kwop API (server only, `lib/kwop.ts`)
`KWOP_API` env var. GET plans · POST /checkout · POST /confirm · GET /plan?email · POST /cancel · POST /event · POST /connect. See `docs/BUILD-SPEC.md` §8. Never hardcode a price or plan id. Kwop tracked link `?k=` → cookie `kwop_k` (30 d) → `profiles.kwop_k` → sent as `k` on checkout.

## Verification loop
After every feature: run, screenshots 390×844 and 1440×900 via `scripts/shot.mjs`, look at them, zero console errors, fix ×3, commit. E2E: `tests/e2e.spec.ts` (landing → sample scan → locked → sign-up → paywall → checkout sheet opens → close → account).

## Environment notes (cloud build)
- Built in a Claude Code cloud session; browser logins replaced by tokens (Supabase access token, Vercel token).
