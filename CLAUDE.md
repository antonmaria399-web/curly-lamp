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

## Plans & quotas (owner answered "keep" — plans read live from Kwop, never hardcoded)
Tier = rank by price of Kwop's plans (`lib/quotas.ts`). Counted on the server per 30-day billing period.
| Tier | Kwop plan today | Scans / period | History | Hidden Fee Hunter | Goal tracker | Faceless Export | Compare over time | Custom rules |
|---|---|---|---|---|---|---|---|---|
| 0 free | — | 3 / day (device + IP + account), report locked | — | — | — | — | — | — |
| 1 | Starter $5/mo ($48/yr) | 10 | 3 months | locked ("Unlock with Pro") | yes | locked | locked | locked |
| 2 ★ | Pro $9/mo ($86/yr) — Most popular | 30 | 12 months | yes | yes | yes | locked | locked |
| 3 | Power $19/mo ($182/yr) | 100 | 36 months | yes | yes | yes | yes | yes |

## Architecture (what lives where)
- `lib/ai.ts` — the only AI entry point (Gemini `GEMINI_MODEL`, default `gemini-flash-latest`); falls back to the PDF text parser (`lib/pdf.ts` + `lib/engine.ts#parseStatementText`) for text PDFs when no key. Leak detection is deterministic in `lib/engine.ts#analyze` for both.
- The uploaded file is **never stored**; only `reports.result` (jsonb).
- Locked viewers get `lib/redact.ts#lock` (leak #1 only, never totals) — blur cannot be bypassed in the browser.
- `lib/kwop.ts` — plans (60 s cache), `getPlan(email)` (60 s cache, `fresh` after payment), checkout/confirm/cancel/event/connect.
- `lib/viewer.ts#getViewer` — user + plan + tier + limits, checked on the server for every paid feature.
- `proxy.ts` — Supabase session refresh, redirects (logged-in `/` → `/dashboard`, app pages need login), cookies `kwop_k` / `bdg_plan` / `bdg_src` (30 d), device id `bdg_dev`.
- Funnel UI: `components/funnel/{scanner,report,unlock,auth-form}.tsx`. Landing: `app/page.tsx` + `components/landing/*`. App: `app/(app)/*` + `components/app/*`.
- Sample statement for "Try a sample": `public/sample-statement.pdf` (regenerate with `node scripts/make-sample.mjs`; it is labelled as an example).
- Lint: `react-hooks/set-state-in-effect` is a warning on purpose (hydration-safe mount state).

## Status / to do
- [x] Steps 0–4, 6–9b code: build + lint clean (warnings only), e2e `tests/e2e.spec.ts` green 3× phone + 3× computer on the production build.
- [x] Verified locally on a real Supabase stack (Docker: `dockerd &` then `npx supabase start -x studio,imgproxy,edge-runtime,logflare,vector,supavisor,realtime,storage-api,postgres-meta`), real Kwop plans and a real Whop checkout created by Kwop.
- [x] Security pass: RLS (another user's rows unreadable / undeletable / unwritable), paid routes checked with getPlan() on the server, no KWOP_API / service key in `.next/static`, zod/regex validation on API routes, error.tsx + not-found.tsx.
- [x] Supabase project live (session 2, Nov 10): existing empty project `kerwcmgziheadbdmczew` (eu-north-1, "antonmaria399-web's Project") used instead of creating a new one; migration applied, RLS on all 5 tables, scan → locked report verified against it. Its host is allowed in the curly-lamp environment. New Supabase + Vercel tokens saved as network secrets and working.
- [x] Vercel: project **budgetoo** (team bufgeto, `prj_443G5HafVUqKOal5xosODNwF8eNB`), Git-linked to this repo, production branch `claude/budgeto-kwop-build-rrbe8d` (push = deploy). URL https://budgetoo-nine.vercel.app. Owner added `KWOP_API` (sensitive) in the Vercel UI; all other env vars set by API. Ids + `KWOP_CONNECT_SECRET` in gitignored `.env.production.local`.
- Kwop connect: `POST /api/kwop/connect` with `Authorization: Bearer $KWOP_CONNECT_SECRET` (server-side, so KWOP_API never leaves Vercel). `scripts/deploy.sh` is superseded by this flow.
- [x] Owner said yes: Supabase email confirmation off (`mailer_autoconfirm`), min password 8, site URL + redirect list set to the Vercel URL.
- [ ] **Go online: `bash scripts/deploy.sh`** (Supabase project + schema + auth config, Vercel project + env + deploy, Kwop connect). Blocked in the first cloud session: the Supabase/Vercel tokens saved as network secrets are rejected (the proxy injects an invalid value). Fix: in the environment settings, delete both network secrets and add the tokens again (Supabase `sbp_…` token, Vercel token), or add them as env vars `SUPABASE_ACCESS_TOKEN` / `VERCEL_TOKEN` and allow hosts api.supabase.com + api.vercel.com.
- [ ] After deploy: test the live URL (e2e with `BASE_URL=… npx playwright test`; needs `<ref>.supabase.co`, `*.vercel.app` host, cdn.whop.com / whop.com allowed for the sandbox browser), check https://kwop.io/budgeto/app.
- [ ] Gemini key (owner) → `GEMINI_API_KEY` in .env.local + Vercel. Until then text PDFs work with the built-in parser; photos ask for the PDF.
- [ ] Google sign-in (owner steps, then Supabase `external_google_*` + `NEXT_PUBLIC_GOOGLE_ENABLED=1`).

## Local testing
- `.env.local`: local Supabase keys, `FREE_TRIES_PER_DAY=1000`, `DEV_PAID=email:planId,…` (fakes a paid plan, ignored in production). Test users power@ / starter@budgeto-test.dev, password `Leaks-are-bad-2026`.
- Behind the sandbox proxy, run Node with `NODE_USE_ENV_PROXY=1 NO_PROXY="localhost,127.0.0.1,$NO_PROXY"` so server fetches to Kwop work.
- Screens: `node scripts/slices.mjs / home 390 844`, `node scripts/funnel-shots.mjs 390 844`, `node scripts/app-shots.mjs power@budgeto-test.dev 390 844 [scans]`.
- E2E: `WHOP_STUB=1 npx playwright test --repeat-each=3` (stub only because cdn.whop.com is blocked in the sandbox).

## Kwop API (server only, `lib/kwop.ts`)
`KWOP_API` env var. GET plans · POST /checkout · POST /confirm · GET /plan?email · POST /cancel · POST /event · POST /connect. See `docs/BUILD-SPEC.md` §8. Never hardcode a price or plan id. Kwop tracked link `?k=` → cookie `kwop_k` (30 d) → `profiles.kwop_k` → sent as `k` on checkout.

## Verification loop
After every feature: run, screenshots 390×844 and 1440×900 via `scripts/shot.mjs`, look at them, zero console errors, fix ×3, commit. E2E: `tests/e2e.spec.ts` (landing → sample scan → locked → sign-up → paywall → checkout sheet opens → close → account).

## Environment notes (cloud build)
- Built in a Claude Code cloud session; browser logins replaced by tokens (Supabase access token, Vercel token).
