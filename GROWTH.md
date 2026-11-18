# Budgeto — go-to-market plan (GROWTH.md)

> Angle: **"I found a $200 monthly subscription I forgot about in 5 seconds."**
> Budgeto's prices (from Kwop, Nov 18 2026): Starter $5/mo ($0.17/day) · **Pro $9/mo ($0.30/day)** · Power $19/mo ($0.63/day). Yearly −20%: $48 · $86 · $182.
> The scripts, hooks and messages below also live in `lib/growth-content.ts` and in **/admin → Scripts / Messages** (with Copy buttons).

## 1. What already sells apps like this (research, Nov 2026)

How this was researched: web search on TikTok/Instagram for the words savers use ("forgot to cancel my subscription", "how to tell what subscriptions I pay for", "app that tells you all your subscriptions", "#rocketmoney", YNAB / Copilot names). TikTok itself refuses connections from the build machine, so **view counts could not be read directly**: the numbers below are the ones search engines show (likes/views) and are marked as such. Before copying a format, open the link on your phone and note the real views.

| # | Video | Account | Shown count | Hook (first line) | What's shown |
|---|---|---|---|---|---|
| 1 | https://www.tiktok.com/@theguillorys/video/7184538890626256170 | @theguillorys | 24.5K likes (#ad) | "Got useless subscriptions? Cancel them with Rocket Money" | Couple, phone screen: app lists their subscriptions, they cancel one on camera |
| 2 | https://www.tiktok.com/@rocketmoney/video/7159700749197397294 | @rocketmoney | ~36 likes | "TFW you cancel forgotten subscriptions" | Brand meme format: reaction + app screen (brand accounts get far fewer views than creators) |
| 3 | https://www.tiktok.com/@youneedabudget/video/7069958832516009259 | @youneedabudget | 11.9K likes | Reply to a comment: "Your budget has your back" | Reply-to-comment talking head + app screens (credit card budgeting) |
| 4 | https://www.tiktok.com/@ynabofficial/video/7504790082411433246 | @ynabofficial | not shown | "Spreadsheet budget vs. the YNAB app — my story" | Before/after: spreadsheet → app |
| 5 | https://www.tiktok.com/@ynabofficial/video/7134842385900522795 | @ynabofficial | ~580 likes | "How to budget! A step by step guide…" | Step-by-step screen recording |
| 6 | https://www.tiktok.com/@ynabofficial/video/7174919932948319534 | @ynabofficial | not shown | "The top 3 best budgeting apps for 2023" | List format, app shown as #1 |
| 7 | https://www.tiktok.com/discover/app-that-tells-you-about-all-of-your-subscriptions (@empress.essentials) | @empress.essentials | not shown | "POV: you finally add up all your subscriptions 😳 I ran everything through this app and it literally found all of them" | POV reaction to the total |
| 8 | same discover page (@emma_finance) | @emma_finance | not shown | Emma app catches forgotten subscriptions | App screen recording + caption |
| 9 | https://www.tiktok.com/discover/i-forgot-to-cancel-my-subscription | top video on the page | ~1.8M views (page listing) | "I forgot to cancel my subscription" | Storytime / rant about a forgotten charge, refund tips |
| 10 | https://www.tiktok.com/discover/how-to-see-what-reoccuring-charges-are-going-on-my-card (@teslacali) | @teslacali | not shown | "It's the $8–$15 subscriptions you forgot about" | Talking head: small charges are the real leak, find them in the bank app |

**The 3 formats that come back most:**
1. **The subscription audit / POV total** (#1, #7, #8, #10): add up what you pay, react to the total, cancel on camera.
2. **Routine / step-by-step where the app is one step** (#3, #5, #6, payday-planning videos): a money routine, the app appears naturally.
3. **Storytime / reaction** (#9, roasts and stitches): a forgotten charge story or a reaction to someone's statement; very high comments.

## 2. Creators who already post for the competitors (first to contact)

Average views were not readable from the build machine: open each profile, note the average of the last 10 videos in /admin when they apply.

| # | Profile | Why |
|---|---|---|
| 1 | https://www.tiktok.com/@theguillorys | Posted a paid Rocket Money video (#ad) |
| 2 | https://www.tiktok.com/@empress.essentials | "Added up all my subscriptions" app video |
| 3 | https://www.tiktok.com/@emma_finance | Subscription-finding app content |
| 4 | https://www.tiktok.com/@teslacali | "Forgotten $8–$15 subscriptions" angle |
| 5 | https://www.tiktok.com/@mrmoneyjar | Money tips, budgeting |
| 6 | https://www.tiktok.com/@humphreytalks | Personal finance explainers |
| 7 | https://www.tiktok.com/@erikakullberg | Consumer rights, "fine print" (subscriptions/refunds) |
| 8 | https://www.tiktok.com/@cazzatime | Short money tips (~400K followers per a 2026 roundup) |
| 9 | https://www.tiktok.com/@financialfreedomlegacy | Large finance audience |
| 10 | https://www.tiktok.com/@financielle | Budgeting, women & money (~2M followers per a roundup) |
| 11 | https://www.tiktok.com/@thisgirltalksmoney | Money talk |
| 12 | https://www.tiktok.com/@herfirst100k | Personal finance |
| 13 | https://www.tiktok.com/@frugal_spender | Frugal living |
| 14 | https://www.tiktok.com/@penniestopounds | Saving tips |
| 15 | https://www.tiktok.com/@bradleyonabudget | Budgeting |
| 16 | https://www.tiktok.com/@breyannanava | Posted about cancelling unwanted subscriptions |
| 17 | https://www.tiktok.com/@alyssadavies | Budgeting (~85K followers per a roundup) |
| 18 | https://www.tiktok.com/@claudiagleason | Small money creator (~11K): the size that answers DMs |
| 19 | https://www.tiktok.com/@theweeblings | Couple's money (~40K) |
| 20 | Search "payday routine" / "budget with me" on TikTok, pick 5 accounts with 1K–20K followers posting weekly | Small accounts reply and price low |

(Handles 5–19 come from public 2026 creator roundups and search results; for 16–19 only the creator's name was published, so the handle is a best guess: search the name on TikTok and verify each profile is still active before you DM.)

## 3. The 3 formats rewritten for Budgeto

Each: hook in 2 seconds → a process from A to B where Budgeto is **one natural step** (never a plain demo) → comment keyword that gets the link in DM. Full second-by-second beats + on-screen text are in /admin → Scripts.

### Format 1 — The 5-second subscription audit · keyword **LEAKS**
0–2 s hook on screen · 2–6 s download last month's PDF in the bank app (account number blurred) · 6–12 s drop it into Budgeto, the scan runs · 12–18 s first leak appears, react · 18–25 s the monthly and yearly total, say what you'll do with it · 25–30 s cancel one on camera, "Comment LEAKS".
Hooks:
1. I found a $200 monthly subscription I forgot about in 5 seconds
2. POV: you finally add up every subscription you pay
3. My bank statement was hiding $61 a month from me
4. I've been paying for a gym I quit in 2024
5. Doing a subscription audit before payday
6. This is how much I was leaking every month
7. Never checked my statement like this before
8. My boyfriend thought we didn't have subscriptions
9. 3 apps I forgot I was paying for
10. Cancelling everything I don't use, live

### Format 2 — Payday reset (Budgeto is step 3) · keyword **PAYDAY**
0–2 s "Payday reset with me" + paycheck (round example number) · 2–8 s bills first · 8–15 s "now the part everyone skips": scan last month's statement · 15–22 s what it flagged, keep/cancel each · 22–28 s move the freed money to savings · 28–32 s "Comment PAYDAY".
Hooks:
1. Payday reset: the step that saved me $40 this month
2. How I split my $2,000 paycheck (and found a leak)
3. Doing my monthly money reset before I spend a dollar
4. The 4 things I do every payday
5. Payday routine for people who live paycheck to paycheck
6. I check THIS before I pay any bill
7. My payday reset found a fee my bank never told me about
8. First payday of the month, let's clean it up
9. Budget with me: $1,850 paycheck
10. Everyone skips this payday step

### Format 3 — Statement roast / reaction · keyword **ROAST**
0–2 s "Send me your statement and I'll find your leaks" (or stitch) · 2–10 s green screen over the **sample statement or a consenting follower's, anonymised** · 10–18 s run it through Budgeto, point at each flagged charge · 18–25 s "that's a car payment a year" · 25–30 s "Comment ROAST".
Hooks:
1. Roasting your bank statements part 1
2. You said you don't have subscriptions. Your statement says otherwise
3. Rate this person's subscriptions
4. I let AI read my bank statement
5. Things on your statement you should cancel today
6. Your bank is charging you for this
7. If you have these 3 charges, cancel them
8. Reading my followers' statements (with permission)
9. What a $14/month leak costs you in 5 years
10. This one fee is on half the statements I see

Rules on camera: real numbers or the sample statement said as a sample; never an account number; never "Budgeto knows which apps you use" (it can't: it flags recurring charges, you decide).

## 4. The strategy, decided by numbers

1. **Organic first.** You post the 3 formats on **2 accounts about this topic only**, 1 to 3 videos a day. **Under 200 views after 2 hours = the hook failed: redo it with a new hook. Over 1,000 = make 2 more versions of it.** Each account's bio link: its own Kwop tracking link (Kwop → Tracking), so revenue is split per account/format.
2. **RPM = revenue ÷ views × 1,000, per format**, as soon as a format brings payments. The format with the best RPM wins, not the one with the most views.
   - Example with Budgeto's prices: a format gets 60,000 views and brings 6 Pro payments ($9) + 2 Starter ($5) = $64 → RPM = 64 ÷ 60,000 × 1,000 = **$1.07**.
   - A yearly Pro ($86) counts as $86 in the month it's paid.
3. **Creators, the week a format proves it**, paid per 1,000 views **at most a third of that format's RPM**, with a cap per video, every Monday, plus a share of the sales they bring with their own link.
   - The app's defaults are `CREATOR_RATE=$1` per 1,000 views and `CREATOR_CAP=$100` per video. **$1/1,000 is only safe once a format's RPM is ≥ $3** (≈ 1 Pro payment per 3,000 views). With the example RPM of $1.07, set `CREATOR_RATE=0.35` in Vercel before recruiting.
   - Cap: $100/video = 100,000 paid views at $1. Keep it until a creator's videos prove their RPM.
   - Sales share: 30% of the first payment of every subscriber their link brings (Pro monthly: $2.70; Pro yearly: $25.80).
4. **Affiliates** (a share of each subscriber they bring, e.g. 30% of the first 3 months: Pro = $8.10) once the first 20 customers are happy (no refund requests, at least 2 scans each).

## 5. The first 30 days

**Week 1 — the formats**
- Day 1: create 2 TikTok accounts (+ the same 2 on Instagram Reels) about saving money only; bio = Kwop tracking link per account. Post Format 1, hook 1.
- Day 2: Format 1 hooks 2–3; Format 2 hook 1.
- Day 3: Format 3 hook 1; apply the 200 / 1,000 rule to days 1–2.
- Day 4: redo every hook under 200 views; 2 more versions of anything over 1,000.
- Day 5: 3 videos (best format ×2, a new format ×1).
- Day 6: reply to every "LEAKS / PAYDAY / ROAST" comment with the link in DM.
- Day 7: write views per format in a note; keep the 2 best hooks of each format.

**Week 2 — views into customers**
- Day 8: check Kwop: sign-ups and payments per tracking link. Compute RPM per format.
- Day 9: if views but no sign-ups: the CTA is weak — say "comment LEAKS" in the first 5 s too.
- Day 10: if sign-ups but no payments: show the full report reveal at the end of the video (the payoff).
- Day 11–12: 3 videos a day on the best-RPM format only.
- Day 13: post the side-income story ("I pay people to post…", /admin → Messages).
- Day 14: RPM again. Decide `CREATOR_RATE` = RPM ÷ 3.

**Week 3 — creators**
- Day 15: DM 20 creators from section 2 with the first DM (no price, no link).
- Day 16: answer replies with the reply message (rate, Monday pay, link to /creators).
- Day 17: accept the first 5 applications in /admin → Creators, create their Kwop links, copy the welcome message.
- Day 18–20: each creator posts their first 10 videos on the same script.
- Day 21: Monday payout from /admin (views × rate ÷ 1,000, capped).

**Week 4 — double what works**
- Day 22: rank creators by RPM (revenue of their link ÷ their views).
- Day 23: top 2 creators: ask for 2 videos a day; stop anyone under RPM/3 after 10 videos.
- Day 24: 10 new creators, same DM.
- Day 25: turn the best video of the month into the landing VSL voice-over (VSL.md).
- Day 26–27: post the best format on both accounts 3× a day.
- Day 28: Monday payout; open affiliates to happy customers.
- Day 29–30: write the next month's plan from the numbers: keep the top format + top 3 creators, double their budget.

## 6. The creator messages (also in /admin → Messages)

- **First DM** (no price, no link): "Hey {first name}! Loved your {one real detail from their profile}. Paid video collab for your account? Scripts provided."
- **Reply once they answer**: "Awesome! It's for Budgeto, an app that finds forgotten subscriptions from a bank statement PDF in seconds. Pay: $1 per 1,000 views (up to $100 per video), paid every Monday, plus a share of the sales you bring with your own link. Two formats that work: "the 5-second subscription audit" and "payday reset". Apply here and you'll get both scripts + your link: https://budgetoo-nine.vercel.app/creators" (the rate follows `CREATOR_RATE` / `CREATOR_CAP`).
- **Side-income post** (story + video): "I pay people to post short videos about my app. No followers needed. Comment CREATOR."
- **Accepted**: the 2 formats, their first 10 videos on the same script, their own link, the 200-view rule and payday (Monday). Generated per creator by "Copy the welcome message" in /admin → Creators.

Sources: [TheGuillorys #ad](https://www.tiktok.com/@theguillorys/video/7184538890626256170) · [Rocket Money](https://www.tiktok.com/@rocketmoney/video/7159700749197397294) · [#rocketmoney](https://www.tiktok.com/tag/rocketmoney?lang=en) · [YNAB official](https://www.tiktok.com/@ynabofficial/video/7134842385900522795) · [@youneedabudget](https://www.tiktok.com/@youneedabudget/video/7069958832516009259) · [App that tells you all your subscriptions](https://www.tiktok.com/discover/app-that-tells-you-about-all-of-your-subscriptions) · [I forgot to cancel my subscription](https://www.tiktok.com/discover/i-forgot-to-cancel-my-subscription) · [Recurring charges on my card](https://www.tiktok.com/discover/how-to-see-what-reoccuring-charges-are-going-on-my-card) · [Tembo: TikTok finance accounts 2026](https://www.tembomoney.com/learn/top-tiktok-finance-accounts-to-follow) · [The Female Lead: money influencers](https://www.thefemalelead.com/post/the-tiktok-money-influencers-gen-z-are-trusting-for-financial-advice) · [Copilot review 2026](https://thecollegeinvestor.com/41976/copilot-review/)
