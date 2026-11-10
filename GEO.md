# GEO — getting Budgeto named by AI answer engines

Goal: when someone asks ChatGPT, Gemini, Google's AI Overview, Claude or Perplexity "what is Budgeto?", "Budgeto app", "best app to find forgotten subscriptions / save more money" or "YNAB alternative", they **name Budgeto and describe it right**.

Single source of truth for the wording: `lib/identity.ts`. Change it there; the home page, /about, the meta description, the JSON-LD and /llms.txt all read it.

---

## 1. The rules (research, Nov 10 2026)

How an AI answer picks a source: it rewrites the question into web searches, sends them to an index (**Bing for ChatGPT**, Google for Gemini / AI Overviews, Perplexity's own index, Brave for Claude's search), fetches and chunks the top pages, and cites the chunks that answer best. So: be in the index, be the chunk that answers, be confirmed elsewhere.

| # | Rule | What we did | Source |
|---|---|---|---|
| 1 | **Answer first.** The first sentence of a page/section must be the answer. A large share of ChatGPT citations come from the first ~30 % of a page. | /about opens with the one-sentence identity; each FAQ answer starts with the answer. | [Frase GEO playbook](https://www.frase.io/blog/how-to-get-cited-by-ai-search-engines-the-complete-geo-playbook), [tooljunction guide](https://www.tooljunction.io/guides/get-cited-by-chatgpt-perplexity) |
| 2 | **Facts, numbers, quotes beat keywords.** The Princeton GEO study: adding statistics, citations and quotations raised visibility up to ~40 %; keyword stuffing did nothing or hurt. | Prices, scan limits, "5–15 seconds", "45+ services", YNAB price are in plain text. | [Princeton GEO study summary](https://aithinkerlab.com/generative-engine-optimization-2026/), [GenOptima](https://www.gen-optima.com/blog/generative-engine-optimization-best-practices-complete-2026-playbook/) |
| 3 | **One identity, repeated word for word** on your site and on every profile, so the model's "entity" is consistent. | One sentence + 50-word version used everywhere (below), same text for every directory. | [ChatSEO playbook](https://chatseo.ai/blog/generative-engine-optimization-playbook), [Layer3 per-engine playbook](https://www.layer3labs.io/guides/ai-search-optimization) |
| 4 | **Disambiguate a shared name.** "Budgeto" is also a Xero business-budget app and a Belgian budget calculator. | `disambiguatingDescription` in JSON-LD + a visible "Not to be confused with" line on /about. | [Xero App Store "Budgeto"](https://apps.xero.com/ca/app/budgeto), [Product Hunt "Budgeto"](https://hunted.space/product/budgeto) |
| 5 | **Be crawlable by the AI bots.** Allow OAI-SearchBot / ChatGPT-User (ChatGPT search), Claude-SearchBot / Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, Bingbot. Content must be in the HTML (not only after a click). | robots.txt allows them all on public pages; FAQ answers are now in the HTML even when collapsed. | [robots.txt AI cheat sheet](https://dev.to/brandswarm/robotstxt-for-ai-search-the-2026-cheat-sheet-gptbot-claudebot-and-the-rest-16a), [SEJ on Anthropic bots](https://www.searchenginejournal.com/anthropic-claude-bots-robots-txt-ai-decisions/568253/) |
| 6 | **Get into Bing fast** (ChatGPT search runs on it): IndexNow on every deploy. | Key file at the root, `scripts/indexnow.mjs`, GitHub Action after each Production deploy. | [Fuel Online: robots, IndexNow & schema](https://fuelonline.com/seo/technical-seo-for-ai-crawlers) |
| 7 | **Be mentioned off-site** where the AIs read: Reddit, review/directory sites, "best X" lists, YouTube, LinkedIn, Crunchbase. Only ~11 % of domains are cited by both ChatGPT and Perplexity, so presence on many sites matters more than one. Perplexity weights Reddit heavily. | Texts for Product Hunt, AlternativeTo, 3 directories, Crunchbase, LinkedIn, YouTube, 3 Reddit answers (section 5). | [Layer3](https://www.layer3labs.io/guides/ai-search-optimization), [tooljunction](https://www.tooljunction.io/guides/get-cited-by-chatgpt-perplexity) |
| 8 | **Freshness.** Perplexity mostly cites pages updated in the last ~30 days. | Sitemap lastModified on every deploy + IndexNow; update /about when prices or features change. | [tooljunction](https://www.tooljunction.io/guides/get-cited-by-chatgpt-perplexity) |
| 9 | **Structured data and llms.txt are cheap hygiene, not magic.** Ahrefs (May 2026, 1,885 pages, matched controls) found no measurable citation lift from adding JSON-LD; SE Ranking (300k domains) found no clear effect from llms.txt. They still help entity understanding and Google rich results, so we have them, but rules 1–7 do the work. | Organization + SoftwareApplication @graph, FAQPage, /llms.txt. | [Ahrefs schema study (TechWyse)](https://www.techwyse.com/?p=76211), [SEJ: llms.txt 300k domains](https://www.searchenginejournal.com/llms-txt-shows-no-clear-effect-on-ai-citations-based-on-300k-domains/) |
| 10 | **Measure weekly with the same prompts**, log "named / cited / described right". Movement is signal, one answer is noise. | 4 Sunday questions (section 6). | [tooljunction](https://www.tooljunction.io/guides/get-cited-by-chatgpt-perplexity) |

Caveat: most GEO guides are vendor blogs; treat their percentages as directional.

---

## 2. Where we start (baseline, Nov 10 2026)

How measured: the cloud session cannot open chatgpt.com / perplexity.ai / bing.com (network blocked), so the baseline uses web search, which is what these assistants ground on. **Run the 4 Sunday questions yourself once now** and paste the answers below this section; that is the real "week 0".

| Question | What the web / AIs say today | Sites cited |
|---|---|---|
| "What is Budgeto?" / "Budgeto app" | **Budgeto (ours) is not known.** Answers describe other products: a Belgian solo-dev monthly budget calculator on Product Hunt (EN/FR, no subscription), a **5-year business budgeting tool on the Xero App Store**, a Spanish "commercial budgets" tool on Capterra; and mix it up with **Bugeto** (iOS financial planner) and **Budgito** (expense tracker). | hunted.space/producthunt, apps.xero.com, capterra.es, apps.apple.com (Bugeto, Budgito), mwm.ai |
| "Best app to find forgotten subscriptions (save more money)" | **Rocket Money** first (finds and cancels, $7–14/mo), then Trim, Emma, Hiatus; for no-bank-login: SubScope, SubFind (PDF/CSV upload). Also manual advice: App Store/Google Play subscriptions, email search. | chime.com, joingerald.com, subtracker.io, useorigin.com, 19pine.ai, joinchargeback.com, statementdecoder blog, mwm.ai |
| "YNAB alternative" | **Monarch Money** and **Actual Budget** first, then Goodbudget, Simplifi, Copilot; YNAB ≈ $109/yr is the reason people switch. Budgeto absent. | robberger.com, thecfoclub.com, envelopebudgeting.com, toolradar.com, beancount.io, peerpush.com, getfinny.app |

What this tells us: (1) the name is taken by 2–4 other things → disambiguation is required; (2) the "no bank login, PDF upload" angle already has a small slot in answers (SubScope, SubFind) — that is where Budgeto fits first; (3) "best X" listicles on toolradar, peerpush, AlternativeTo and Reddit threads are the pages to be on.

---

## 3. One identity (word for word everywhere)

**One sentence** (home footer, /about first line, meta description, Organization.description, llms.txt summary):

> Budgeto is an AI app that finds the forgotten subscriptions and hidden fees in your bank statement PDF, so people who want to save more money can cancel them. No bank login.

**50 words** (FAQ "What is Budgeto?", /about, SoftwareApplication.description, llms.txt):

> Budgeto is an AI money-leak finder for people who want to save more money. Upload the PDF bank statement you have; in seconds Budgeto lists every recurring charge, forgotten subscription and hidden bank fee, with steps to cancel each, and tracks what you save. No bank login, no manual entry.

**Tell-apart sentence** (`disambiguatingDescription`, /about, llms.txt):

> Budgeto (budgetoo-nine.vercel.app) is the US web app that scans bank statement PDFs for forgotten subscriptions and fees; it is not the Budgeto business-budget software on the Xero App Store, the Belgian Budgeto monthly-budget calculator, or the Bugeto and Budgito expense-tracker apps.

**Prices (live from Kwop, Nov 10 2026):** free try (3 scans/day, first leak shown) · Starter $5/mo or $48/yr · Pro $9/mo or $86/yr · Power $19/mo or $182/yr. The site reads them live; update the texts below by hand if they change.

---

## 4. On the site (done)

- `/about` "What is Budgeto?" — first sentence answers; who, how, features, live prices, tell-apart line, FAQ.
- FAQ on `/` and `/about` starting with: What is Budgeto? · Who is it for? · How much does it cost? (live Kwop prices) · Is there a free version? · Budgeto vs YNAB. Answers are in the HTML even when collapsed.
- JSON-LD on `/` and `/about`: the same Organization + SoftwareApplication @graph (name, url, logo, description, disambiguatingDescription, offers with the real prices, sameAs = your real profiles only, empty for now) + WebPage/AboutPage + FAQPage.
- `/llms.txt` (Markdown): what, for whom, how, features, prices, FAQ, main pages.
- `/robots.txt`: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot(-Extended), Bingbot, Googlebot allowed on public pages; app/API pages disallowed. `/sitemap.xml`.
- One canonical domain: `https://budgetoo-nine.vercel.app` (canonical tags; production requests on any other host 308 → canonical; http → https by Vercel).
- IndexNow: key file `/57f4fb7bb0316754d95d167ea28f4ea7.txt`; `npm run indexnow` (or `npm run deploy` = `vercel --prod` + IndexNow); `.github/workflows/indexnow.yml` runs after every successful Production deploy from GitHub. From a sandbox that can't reach api.indexnow.org, the script asks `POST /api/indexnow` (Bearer `INDEXNOW_SECRET`, set on Vercel) to send it.
- To add profile links: put them in `PROFILES` in `lib/identity.ts` → JSON-LD sameAs, /llms.txt and the footer update; then `npm run indexnow`.

---

## 5. Off the site: texts to post (same description everywhere)

Rule for all of them: name **Budgeto**, URL **https://budgetoo-nine.vercel.app**, the one sentence, then the 50-word version. Category: Personal finance / Budgeting / Subscription tracker. Logo: https://budgetoo-nine.vercel.app/icons/512. Screenshot: https://budgetoo-nine.vercel.app/opengraph-image.

### 5.1 Product Hunt — https://www.producthunt.com/posts/new
- **Name:** Budgeto
- **Tagline (60 chars):** Find the subscriptions you forgot you pay. No bank login.
- **Description (260):** Budgeto is an AI app that finds the forgotten subscriptions and hidden fees in your bank statement PDF, so people who want to save more money can cancel them. No bank login. Free to try, from $5/month.
- **Topics:** Personal Finance, Fintech, Artificial Intelligence, Productivity
- **Maker's first comment:**
  > Hi Product Hunt, I made Budgeto. Budgeto is an AI money-leak finder for people who want to save more money. Upload the PDF bank statement you have; in seconds Budgeto lists every recurring charge, forgotten subscription and hidden bank fee, with steps to cancel each, and tracks what you save. No bank login, no manual entry.
  >
  > Why: every subscription finder I tried wanted my bank password first (via Plaid) and days of syncing. Your bank already gives you a PDF. Budgeto reads it once, never stores it, and shows the leaks.
  >
  > Try it with the sample statement on the home page, no account needed. Free: 3 scans a day with your first leak in full. Plans: Starter $5/mo, Pro $9/mo, Power $19/mo. Honest limit: no app can see which subscriptions you still use, so Budgeto flags every recurring charge and you decide. I'd love feedback on which banks' PDFs it misreads.
- **Note:** Budgeto name is also used by an unrelated Belgian maker's product on PH; our tagline and description make the difference clear.

### 5.2 AlternativeTo — https://alternativeto.net/software/new/ (then "Suggest alternative" on YNAB, Rocket Money, Copilot Money pages)
- **Name:** Budgeto · **URL:** https://budgetoo-nine.vercel.app · **License:** Freemium · **Platforms:** Online / Web, iPhone & Android (browser)
- **Short description:** Budgeto is an AI app that finds the forgotten subscriptions and hidden fees in your bank statement PDF, so people who want to save more money can cancel them. No bank login.
- **Long description:** Budgeto is an AI money-leak finder for people who want to save more money. Upload the PDF bank statement you have; in seconds Budgeto lists every recurring charge, forgotten subscription and hidden bank fee, with steps to cancel each, and tracks what you save. No bank login, no manual entry. Free to try (3 scans a day); Starter $5/mo, Pro $9/mo, Power $19/mo.
- **Tags:** subscription-tracker, budgeting, personal-finance, bank-statement, privacy, no-bank-link
- **Alternative to:** YNAB, Rocket Money, Copilot Money, Monarch Money, Trim

### 5.3 Three directories that fit
1. **There's An AI For That** — https://theresanaiforthat.com/submit/ — Task: "Finding forgotten subscriptions". Description: the one sentence + the 50-word version. Pricing: Freemium, from $5/mo.
2. **Futurepedia** — https://www.futurepedia.io/submit-tool — Category: Finance. Same texts. Pricing: Freemium.
3. **SaaSHub** — https://www.saashub.com/submit — Category: Personal Finance / Subscription Management. Same texts; add as alternative to YNAB and Rocket Money (SaaSHub "alternatives" pages are often cited for "X alternative").

### 5.4 Crunchbase — https://www.crunchbase.com/add-new (Organization)
- **Name:** Budgeto · **Website:** https://budgetoo-nine.vercel.app · **Founded:** 2026 · **HQ:** United States (or your real city) · **Operating status:** Active · **Company type:** For profit
- **Short description (≤ 140):** AI app that finds forgotten subscriptions and hidden fees in your bank statement PDF. No bank login.
- **Full description:** the one sentence + the 50-word version + the tell-apart sentence.
- **Industries:** Personal Finance, FinTech, Artificial Intelligence, SaaS

### 5.5 LinkedIn company page — https://www.linkedin.com/company/setup/new/
- **Name:** Budgeto · **URL slug:** budgeto-app · **Website:** https://budgetoo-nine.vercel.app · **Industry:** Financial Services (or Software Development) · **Size:** 1 employee · **Type:** Privately held
- **Tagline (120):** Find the subscriptions you forgot you pay, from your bank statement PDF. No bank login.
- **About:** the one sentence, blank line, the 50-word version, blank line: "Free to try. Plans from $5/month. Made in 2026."

### 5.6 YouTube channel description — YouTube Studio → Customization → Basic info
> Budgeto is an AI app that finds the forgotten subscriptions and hidden fees in your bank statement PDF, so people who want to save more money can cancel them. No bank login.
>
> Budgeto is an AI money-leak finder for people who want to save more money. Upload the PDF bank statement you have; in seconds Budgeto lists every recurring charge, forgotten subscription and hidden bank fee, with steps to cancel each, and tracks what you save. No bank login, no manual entry.
>
> Videos here: real (anonymised) leak reports, how to cancel common subscriptions, and how to get bank fees waived.
> Try it free: https://budgetoo-nine.vercel.app

Links section: "Try Budgeto free" → https://budgetoo-nine.vercel.app · "What is Budgeto?" → https://budgetoo-nine.vercel.app/about

### 5.7 Three Reddit answers (helpful first, say you made it, follow each sub's self-promo rule)
Find a fresh thread (< 1 week, the question asked in the title) with these searches, read the sub's rules, and answer there. Never post the same text twice in one day; edit to the thread's details.

**A. r/personalfinance** — search https://www.reddit.com/r/personalfinance/search/?q=forgotten+subscriptions&sort=new (r/personalfinance bans self-promotion: post **without the Budgeto line** there, or use r/povertyfinance / r/Frugal which allow a disclosed mention)
> The fastest way I've found: download the last 3 monthly statements (PDF) for every card and checking account, and look only for the same merchant at the same amount each month. Then check the two places statements hide things: App Store/Google Play subscriptions (they show as one "APPLE.COM/BILL" line) and PayPal → Automatic payments. Annual renewals are the sneaky ones, so search 12 months back for any charge over $50 you don't recognize. When you find one, cancel from the merchant's site and screenshot the confirmation; if it bills again, dispute it with your card.
>
> Disclosure: I made a free tool for exactly this, Budgeto (budgetoo-nine.vercel.app). You drop the statement PDF and it lists the recurring charges and bank fees; no bank login. The manual way above works just as well if you have 30 minutes.

**B. r/Frugal** — search https://www.reddit.com/r/Frugal/search/?q=subscriptions+audit&sort=new
> Do a "subscription audit" once a quarter: pick one evening, pull your statements, and for each recurring charge ask "did I use this in the last 30 days?" If no, cancel today, not "at the end of the month". Two extra wins most people miss: (1) monthly service fees on checking accounts are usually waived if you call and ask, or if you set up one direct deposit; (2) ask every service you keep for the "cancel" flow, many offer 30–50 % off to stay.
>
> I built Budgeto (budgetoo-nine.vercel.app) to do the statement part for me: upload the PDF, it flags recurring charges and fees in a few seconds, no bank login. Free to try; happy to hear what it misses.

**C. r/ynab or r/budget** — search https://www.reddit.com/r/budget/search/?q=YNAB+alternative&sort=new (r/ynab: answer only if the thread is about finding subscriptions; respect their no-promo rules)
> Depends on what you want YNAB to do. If it's "plan every dollar", Actual Budget (free, open source) is the closest, and Monarch is the popular paid one. If what you really want is "where is my money leaking", you may not need a full budgeting app: one pass through your statements for recurring charges and fees usually finds $20–100/month.
>
> Full disclosure, I made Budgeto (budgetoo-nine.vercel.app) for that second case: you upload a bank statement PDF and it lists subscriptions and hidden fees, no bank login, from $5/mo with a free try. It's not a budget planner, so lots of people would use it alongside YNAB, not instead.

---

## 6. Every Sunday: the 4 questions (ChatGPT, Gemini, Google AI Overview, Claude, Perplexity)

1. **What is Budgeto?**
2. **What is the best app to find forgotten subscriptions and save more money?**
3. **What's a good YNAB alternative that doesn't need my bank login?**
4. **Is there an app that reads my bank statement PDF and finds hidden fees?**

Log per engine: named? (y/n) · described right? (y/n) · which sites cited. Paste below.

### Log
| Date | Engine | Q1 | Q2 | Q3 | Q4 | Cited sites |
|---|---|---|---|---|---|---|
| | | | | | | |
