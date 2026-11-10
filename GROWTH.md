# Budgeto — go-to-market plan (GROWTH.md)

> Angle: **« I found a $200 monthly subscription I forgot about in 5 seconds »**
> Everything here is also in the app: **/admin → Scripts** and **/admin → Messages** (with Copy buttons).

---

## 1. What already sells apps like Budgeto (research, Nov 2026)

**Honest note on the data.** The research ran from a cloud sandbox where **tiktok.com, instagram.com and modash.io are blocked**, so view counts per video could not be read. Only what public search results showed is written below. Nothing is invented. The table has a **"views"** column to fill in from the TikTok app (10 minutes, see 1.3).

### 1.1 Videos and sources found (last 90 days where dated)

| # | Where | Account | Hook / what is shown | Views |
|---|---|---|---|---|
| 1 | [TikTok discover: "how to cancel subscriptions Rocket Money"](https://www.tiktok.com/discover/how-to-cancel-subscriptions-rocket-money) | Finance Tips | On screen: **"This app found 6 subscriptions I forgot I was paying for."** Phone screen recording of the app's subscription list, then cancelling. | fill in |
| 2 | [TikTok discover: "how to cancel a subscription in Rocket Money"](https://www.tiktok.com/discover/how-to-cancel-a-subscription-in-rocket-money) | Breyanna Nava | Sponsored (#RocketMoneyPartner): talking head + app list, "cancel in a few taps". | fill in |
| 3 | [TikTok discover: "how to cancel subscription in Rocket Money"](https://www.tiktok.com/discover/how-to-cancel-subscription-in-rocket-money) | _ericacreates | "Getting my finances together for 2026": the app helped cancel **3 subscriptions in 5 minutes**. UGC style, A→B story. | fill in |
| 4 | [TikTok discover: #cancelsubscription](https://www.tiktok.com/discover/cancel-subscription) | a personal-finance creator | Page shows an **8.9M views** label next to a money creator's post (the page does not say which video). Manual "Settings → Subscriptions" tutorial. | 8.9M (label, unattributed) |
| 5 | same page | a money-tips creator | "Cancel Netflix / subscriptions you forgot" tip, 1M views label. | 1M (label) |
| 6 | [TikTok discover: "how to use cancellation app"](https://www.tiktok.com/discover/how-to-use-cancellation-app) | several (Hiatus, Rocket Money, Subwatch) | Screen recordings of subscription trackers; engagement in the hundreds to low thousands of likes. | fill in |
| 7 | [TikTok discover: "how to cancel subscription for views"](https://www.tiktok.com/discover/how-to-cancel-subscription-for-views) | CFP creator (#ad, Truebill era) | "A CFP's method to cancel subscriptions", sponsored. | fill in |
| 8 | [Motion ad library: Rocket Money](https://motionapp.com/library/rocket-money) | podcast hosts (YouTube) | Story read: a listener found her husband spent **$254** on subscriptions → app found them. Integrated read, not a demo. | fill in |
| 9 | [Modash: Rocket Money influencer content](https://www.modash.io/content-library/brands/rocket-money-examples) | YouTube creators (e.g. @GrahamStephan) | Integrated mid-video reads: "I found X subscriptions I didn't know about". | fill in |
| 10 | [CreatorDB: Rocket Money](https://creatordb.app/brands/rocketmoney.com) | ~1.4K creators, ~4.1K sponsored posts, 82 new posts in the last 30 days | Always-on program, mostly YouTube integrations. | — |

### 1.2 The 3 formats that come back most
1. **The "app found X subscriptions" audit** (#1, #3, #6, #9): a number on screen in the first second, the app's list, one cancellation live. → Budgeto format **A. The 5-second money audit**.
2. **The money reset / A→B story** (#3, #8): "getting my finances together", the app is one step of a plan, not the whole video. → Budgeto format **B. The no-spend reset**.
3. **The statement reaction / tutorial** (#4, #5, #7): a creator walks through a statement or a settings screen and points at the leaks. → Budgeto format **C. Reacting to a real statement**.

### 1.3 Complete the table in 10 minutes (on your phone)
1. In TikTok, search each: `forgot I was paying for`, `cancel subscriptions app`, `Rocket Money`, `YNAB`, `Copilot money app`, `app that finds subscriptions`, `bank statement subscriptions`.
2. Filter: Videos · Last 3 months. Open the top 10 that show an app.
3. Write the views, the account and the first sentence on screen in the table above.

## 2. Creators who already post for the competitors (first to contact)

Found in public results (TikTok/Modash were blocked, so average views are to fill in from their profile):

| Creator | Platform | Link | Why | Avg views |
|---|---|---|---|---|
| @holli.grasmeyer | TikTok | https://www.tiktok.com/@holli.grasmeyer | Sponsored by Rocket Money (Modash) | fill in |
| @itsbrejon | TikTok | https://www.tiktok.com/@itsbrejon | Sponsored by Rocket Money (Modash) | fill in |
| @taylorthomasss | TikTok | https://www.tiktok.com/@taylorthomasss | Sponsored by Rocket Money (Modash) | fill in |
| Breyanna Nava | TikTok | search "Breyanna Nava" | #RocketMoneyPartner video | fill in |
| _ericacreates | TikTok | https://www.tiktok.com/@_ericacreates | Subscription-app UGC video (2026) | fill in |
| Finance Tips | TikTok | search "Finance Tips subscriptions I forgot" | "This app found 6 subscriptions…" hook | fill in |

**Get to 20 in 15 minutes:** open [Modash's Rocket Money creator list](https://www.modash.io/content-library/brands/rocket-money-examples/influencers) (10 TikTok creators listed), then in TikTok open the accounts behind every video of section 1.3. Keep accounts with **2,000 to 50,000 average views** (they answer, and their views are cheap). Add them in /admin once they apply.

## 3. The 3 formats rewritten for Budgeto

Each format: a hook in 2 seconds, then a process **from A to B** where Budgeto is **one natural step**, never a plain demo. Ten hooks each. The exact second-by-second scripts and all hooks are in `lib/growth-content.ts` (shown in /admin → Scripts with Copy buttons).

### A. The 5-second money audit — keyword **LEAKS**
| Time | Show | Text on screen |
|---|---|---|
| 0–2 s | Face, phone in hand, bank app open | I found a $200 monthly subscription I forgot about in 5 seconds |
| 2–6 s | Download the statement PDF (real taps) | Step 1: download last month's statement |
| 6–12 s | Drop it in Budgeto: scan line, % climbing | Step 2: drop it in (no bank login) |
| 12–18 s | Leak list, zoom on the total | $___ a month. On things I don't use. |
| 18–25 s | Cancel one live, tap "I cancelled it", saved counter up | Cancelled 3. That's a car payment a year. |
| 25–30 s | Face | Comment LEAKS and I'll send you the link |

Hooks: I found a $200 monthly subscription I forgot about in 5 seconds · My bank statement was hiding $61 a month from me · POV: you finally read your bank statement · I was paying for 3 streaming apps I never open · This is why you're broke every month (it's not coffee) · I checked my statement for 5 seconds and cancelled $94 · Your bank won't tell you about this fee · Things I forgot I was paying for, ranked · I let an AI read my bank statement. It was rude. · The $14.99 you forgot about costs you $180 a year

### B. The no-spend reset (A→B) — keyword **RESET**
| Time | Show | Text |
|---|---|---|
| 0–2 s | Low balance (numbers blurred) | Day 1 of fixing my money before payday |
| 2–8 s | Writing the plan: find leaks, cancel, move the money | The plan: find the leaks first |
| 8–15 s | Budgeto scan, leak list | Step 1 took 5 seconds |
| 15–22 s | Cancel 2, move that amount to savings | Step 2 + 3: cancel, then move it to savings |
| 22–28 s | Saved counter + goal ring | +$___ a month. Same paycheck. |
| 28–30 s | Face | Comment RESET for the app |

Hooks: Day 1 of fixing my money before payday · How I found $100 a month without a side hustle · Money reset: the first thing I do every month · I gave myself 10 minutes to fix my budget · Paycheck to paycheck? Do this before you budget · The boring money habit that paid my phone bill · Month 1 of saving $1,000: step one · You don't need a budget. You need to see your leaks. · Before you open a high-yield savings account, do this · I stopped 4 charges today. Here's how I found them

### C. Reacting to a real statement — keyword **SCAN**
| Time | Show | Text |
|---|---|---|
| 0–2 s | Green screen over an anonymised statement (or Budgeto's sample) | Rating my follower's bank statement |
| 2–10 s | Scroll the raw codes (APPLE.COM/BILL…) | 6 pages of codes. Where's the leak? |
| 10–18 s | Run Budgeto: scan, then list | Let the AI read it |
| 18–26 s | React to the top 3 leaks | This one renews yearly. Sneaky. |
| 26–30 s | Face | Send me yours: comment SCAN |

Hooks: Rating my follower's bank statement · Roasting my own bank statement (it's bad) · Find the forgotten subscription in this statement · This statement has 6 leaks. Can you spot them? · What's actually on a $3,000 paycheck statement · Reading my bank statement so you don't have to · This 'monthly service fee' is optional. Here's why · The subscription everyone forgets (it's on yours too) · I asked an AI to find my wasted money · Bank statement red flags, explained in 30 seconds

**Comment keyword → link in DM:** reply to every "LEAKS / RESET / SCAN" comment with your link `https://budgetoo-nine.vercel.app/?utm_source=tiktok&utm_campaign=<format>` (utm is saved on the account, so /admin shows which format brings sign-ups).

## 4. The strategy, decided by numbers

Budgeto's real prices (from Kwop): **Starter $5/mo · Pro $9/mo (most popular) · Power $19/mo**, yearly −20 % ($48 / $86 / $182).

1. **Organic first.** 2 accounts about money only, 1 to 3 videos a day each, the 3 formats. After 2 hours: **under 200 views → the hook failed, redo it with the next hook**; **over 1,000 → make 2 more versions** of that video (same script, new hook).
2. **RPM per format** = revenue ÷ views × 1,000, as soon as a format brings payments (utm_campaign per format → /admin Numbers + Kwop). Example: 30,000 views → 3 Pro payments ($27) → RPM **$0.90**. The format with the **best RPM wins**, not the one with the most views.
3. **Creators**, the week a format proves itself, paid per 1,000 views **at most a third of that RPM**, with a cap per video, every Monday, plus a share of the sales from their own link. Budgeto's defaults: **$1 per 1,000 views (CREATOR_RATE), cap $100 per video (CREATOR_CAP)** — that is only safe once a format's RPM is **≥ $3** (one $9 payment per 3,000 views). If the RPM is lower, lower CREATOR_RATE (e.g. RPM $0.90 → $0.30 per 1,000) before you scale. Sales share: **20 % of the first 3 months** of each subscriber from their link.
4. **Affiliates** once the first 20 customers are happy: **30 % of every payment for 12 months** for anyone with a Kwop tracked link (Kwop → Tracking). A Pro yearly ($86) pays an affiliate $25.80.

## 5. The first 30 days

**Week 1 — the formats**
- Day 1: Create 2 TikTok accounts (+ Instagram) about saving money. Bio: "Finding the money you forgot about" + link.
- Day 2: Film format A with hook 1 and 2. Post 2 on each account.
- Day 3: Format B, hooks 1–2. Check the 2-hour rule on day 2's videos.
- Day 4: Format C, hooks 1–2. Redo every video under 200 views with a new hook.
- Day 5: 3 videos: the best format so far × 3 new hooks.
- Day 6: Reply to every comment keyword with the link (utm per format).
- Day 7: Write views per video in a sheet. Keep the 2 best hooks per format.

**Week 2 — views into customers**
- Day 8: Read /admin Numbers: sign-ups and paywall views per format.
- Day 9: Pin a comment with the link on every video over 1,000 views.
- Day 10: Make 2 more versions of every video over 1,000 views.
- Day 11: Post the side-income story: "I pay people to post short videos about my app. No followers needed. Comment CREATOR."
- Day 12: First RPM per format. Drop the worst format.
- Day 13: 3 videos a day of the winning format.
- Day 14: Answer every "Why people cancel" line in /admin; fix the top reason.

**Week 3 — creators**
- Day 15: Send the first DM to 10 creators from section 2 (no price, no link).
- Day 16: 10 more DMs. Reply to answers with message 2 (rate, formats, /creators).
- Day 17: Accept applications in /admin, create each creator's link in Kwop → Tracking, paste the code, send "Accepted".
- Day 18: Each creator posts video 1 of 10 (same script).
- Day 19: Check the 200-view rule with them; swap hooks.
- Day 20: 10 more DMs.
- Day 21: First Monday payout in /admin → Creators (views × rate ÷ 1,000, capped).

**Week 4 — double what works**
- Day 22: Rank creators by sign-ups per 1,000 views (Numbers → sign-ups by creator link).
- Day 23: Give the top 3 creators the best hooks of your own accounts.
- Day 24: Stop creators under 200 views per video after 10 videos.
- Day 25: 20 new DMs to accounts like your top 3.
- Day 26: Open affiliates (30 % for 12 months) to your happiest customers.
- Day 27: Post 3 versions of the best video on Instagram Reels.
- Day 28: Second payout. Recompute RPM per format and CREATOR_RATE.
- Day 29: Double the posting rate of the best format (3 → 6 a day across accounts).
- Day 30: Write down what worked; plan month 2 on the 2 best formats only.

## 6. The creator messages (also in /admin → Messages)

1. **First DM** (no price, no link): "Hey {name}! Loved your video about [one real detail from their profile]. I make Budgeto, an app that finds forgotten subscriptions in a bank statement. Paid video collab for your account? Scripts provided."
2. **Reply once they answer**: the pay ($1 per 1,000 views, up to $100 per video, paid every Monday, plus a share of the sales from their own link), the 2 formats (5-second money audit, no-spend reset), and the link to /creators.
3. **Side-income post** (story + video): "I pay people to post short videos about my app. No followers needed. Comment CREATOR."
4. **Accepted**: the 2 formats, their first 10 videos on the same script, their own link, the 200-view rule and payday (Monday; send links + views by Sunday night).

Sources: [TikTok discover pages](https://www.tiktok.com/discover/how-to-cancel-subscriptions-rocket-money), [Modash Rocket Money influencers](https://www.modash.io/content-library/brands/rocket-money-examples/influencers), [Modash Rocket Money content](https://www.modash.io/content-library/brands/rocket-money-examples), [CreatorDB Rocket Money](https://creatordb.app/brands/rocketmoney.com), [Motion ad library](https://motionapp.com/library/rocket-money), [Rocket Money affiliates](https://www.rocketmoney.com/affiliates), [Copilot vs YNAB](https://www.copilot.money/compare/ynab), [YNAB vs Copilot pricing](https://www.costbench.com/compare/ynab-vs-copilot-money/).
