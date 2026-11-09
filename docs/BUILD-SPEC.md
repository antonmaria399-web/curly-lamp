You are the founding engineer and product designer of Budgeto. Build Budgeto, a complete and real SaaS, in this empty folder, put it online and connect it to Kwop. Do ALL of it yourself, from start to finish, in one go. The bar: someone who opens it should think a funded startup made it, and want to pay for it.
This message is long on purpose: it is the method of a SaaS that sells. Read it all before you start.
Build level: the PREMIUM build (Kwop Builder). Build exactly this level, all of it.

## How we work (read this twice)
- I am not a developer. Never ask me product or design questions: every decision is in this message. When something is not specified, do what the best SaaS in this space do, write the choice in CLAUDE.md, and keep going. The one choice I make is my prices, once, right after step 0 (section 7).
- The only things I will do: approve your commands, pick my prices once (section 7), and sign in when a browser window opens (Supabase, Vercel, Google). Each time, tell me in one line: "A window opened: sign in with Google or GitHub, then come back here."
- Never stop half way to report progress. Work until the software is online, tested on a phone and on a computer, and connected to Kwop, then send me the final message described at the end.
- If a command fails, read the error, fix it and continue. Try another way before giving up on anything.
- You never move on from something you have not seen working with your own eyes (section 11).

## 1. The product
- Name: Budgeto
- In one line: Stop wondering where your paycheck went.
- What it does: Upload a PDF statement, let AI scan your habits, and build your savings effortlessly.
- For: people wanting to save more money (Money & saving)
- The original idea: Upload your bank statement and get a breakdown of your top 3 useless expenses in seconds.
- The problems we solve:
  - Bank statements are too confusing to analyze
  - Subscriptions hide in plain sight for months
  - Budgeting apps require too much manual entry
- What changes for the user:
  - AI reads your PDF statement in seconds
  - Instant flagging of recurring hidden fees
  - Zero manual entry needed to find leaks
- Features, most important first:
  1. PDF Statement Scan: Drag and drop your bank export to parse transactions automatically.  ← the core feature: the RESULT comes from here
  2. Hidden Fee Hunter: Our AI isolates recurring charges you haven't used in 90 days.
  3. Savings Goal Tracker: Set a monthly target and watch your freed-up cash stack up.
  4. Faceless Export: Generate clean stats screens ready for your short videos.
- How it works for the user:
  1. Upload: Drop your last month's bank statement PDF securely into the app.
  2. Analyze: The AI categorizes spending and highlights wasted money.
  3. Save: Cancel unwanted subscriptions and watch your savings grow.
- Market: the United States. Write for people there (their words, their references).
- Apps people already pay for in this space: YNAB, Copilot. Study them first (step 0); check each one really does this job, and replace any that doesn't.
- The angle that sells it in short videos: « I found a $200 monthly subscription I forgot about in 5 seconds ». The landing page and its first screen must make this moment visible.
- Language of the whole app: English. Currency: USD.
- Only build what a website can really deliver. If a feature above needs powers a web app does not have (blocking other apps on a phone, reading notifications…), build the closest real version, say so honestly in the app, and never promise more on the landing page.
- The RESULT: decide in 1 to 3 words, from the user's side, what Budgeto gives them ("your workout plan", "your video", "your score"). Write it in CLAUDE.md as RESULT. It names the main button, the creating screen, the paywall title and the notifications.

## 2. Why this method: the rules that make it sell
Budgeto follows the method of Kwop, whose own SaaS turns visitors into paying customers every day. Every rule below exists because it made money. Follow them literally, never "improve" them away. HOW each rule looks is designed for Budgeto (section 3): two Kwop SaaS never look or flow the same.
1. The landing page sells the RESULT, never the price. No plans, no prices, no pricing section and no "Pricing" link anywhere on the landing page: a price before the value is a reason to leave. Prices appear only in the paywall, after the visitor has seen their own RESULT being made.
2. One action everywhere, in this niche's words. Every main button says the same verb + RESULT ("Predict this match", "Rate my selfie", "Make my first video") and leads straight into the funnel.
3. Value before any price, and before any form when possible. If the visitor can get a real first result in 3 taps or less without an account, they do it right on the landing page: the hero IS the product. Otherwise a short personal flow (3 to 6 one-tap questions) builds it.
4. Sign-up in one tap, at the right moment: "Continue with Google" first and biggest, email + password under it, no email confirmation, no card, no extra field. It appears when the visitor wants to keep or unlock their result (try-first funnel), or right after the landing page (personal-flow funnel). Their result is never lost: it is saved and waits for them.
5. The aha moment is watching THEIR result being made: the work shown step by step and a percentage up to 99 %, then "Your RESULT is ready."
6. The paywall opens at the peak, over their own result: a real part in clear, the rest blurred, one unlock button in this niche's words ("Unblur the score", "See my full result"). Never before (they want nothing yet), never after (they already got what they came for).
7. Prices are shown per day: "$0.30 / day" big, "$9 / month" small. A daily price feels like nothing next to a result they already want.
8. The checkout opens inside the page, never on another site. Kwop learned it the hard way: when buyers were sent to an outside checkout page, most of them never paid. With the checkout inside a sheet over the paywall, they pay.
9. Three plans that make people climb. Each plan is made for one kind of person, described in this niche's units, with clear quotas. A lower plan visibly misses something the user will want; hitting a limit shows the next plan with exactly what it adds.
10. Phones first. Most buyers pay on a phone (88 % of Kwop's payers). Design every screen at 390 px wide first, then make it beautiful on a computer.
11. Everything works for real: real accounts, the real engine computing the real result from real data, the real checkout. No fake data, no placeholder result, no dead button, no "coming soon" in the funnel.
12. Zero friction, zero dead ends: no blank page, no endless spinner, no language mix, no layout jump. A returning visitor lands where they stopped (their result under the paywall if they did not pay, the app if they did).
13. Honest: no fake reviews, no invented user counts, revenue, logos or press, no fake countdown or "3 spots left". Numbers on the landing page are true product facts ("Ready in 60 seconds") or real counts from your database once they are worth showing.

## 3. Budgeto's own funnel and look (never a template)
Every Kwop SaaS gets its own funnel and its own design, made for its niche. Someone who saw another Kwop SaaS must not recognise a template here: Budgeto must feel like the best-designed app of its niche.
- What Kwop sees: Budgeto gives an analysis of what they upload (Money & saving). The starting funnel (check it against the best apps of this niche in step 0, then make it Budgeto's own, with its own objects and words):
  - Funnel type: TRY FIRST: the product works right on the landing page, no account needed to see the teaser.
  - The first 10 seconds: the visitor takes or uploads it right in the hero (a big friendly drop zone that opens the camera on phones, plus an example they can try in one tap).
  - The teaser: a scanning animation over their own upload (lines, points, a progress ring), then the main result (the score, the verdict, the amount found) big but blurred, with their upload and one insight in clear.
  - The unlock: "See my full result" → sign-up in one tap (Google) if they have no account yet, titled in this niche's words ("Save your prediction") → the paywall right away, their blurred result still behind it.
  - The plans speak in: analyses a month, detailed reports, comparisons over time, saved history.
  - Watch out: uploads are private: say where they are stored and let people delete them; kind, useful wording, never harsh judgements on bodies.
- The visual direction for Money & saving: trust and precision: white and ink, one green for gains and one red for losses, a crisp sans (Inter) with tabular figures (JetBrains Mono for numbers), clean charts and counters. The main color stays #C8FF3D (the brand color of its Kwop page) unless it fights this direction: then keep it as the accent. Never a default look (no "purple gradient on black" unless the niche calls for it), never a generic template.
- Step 0b, before any code: write Budgeto's final blueprint in CLAUDE.md, concrete to the product: the RESULT; the funnel type and why; the hero (what the visitor sees and does in the first 10 seconds); every screen of the funnel in order with its exact copy; what is clear and what is blurred; the unlock button's words; when sign-up appears; the paywall's title ("Your RESULT is ready." in this niche's words, like "Your Arsenal – Chelsea prediction is ready.") and its personal line; each plan's tag, quotas and "What you unlock" in the niche's units; the magic moment on the landing page (the live product, a device frame, or this niche's notifications); the visual direction made precise (colors with hex codes, the two fonts, 3 signature visual elements of this niche).
- How different two Kwop SaaS must be (examples, do not copy them):
  - Football predictions: the hero is a team picker (two shields, "Predict"); a 3-second analysis animates; the predicted score "2 – 1" appears big and blurred with the confidence bar in clear; "Unblur the score" → Google sign-up sheet → paywall "Your Arsenal – Chelsea prediction is ready"; plans in predictions a week and leagues; stadium-at-night design with a scoreboard font.
  - Selfie rating: the hero is a camera drop zone; a scan animates over their own photo; the score is blurred, one insight is clear; "See my full result" → sign-up → paywall; soft editorial design with a serif.
  - Workout plan: "Build my plan" → Google → 4 one-tap questions → the plan builds itself → day 1 clear, weeks 2 to 4 blurred → paywall "Your 4-week plan is ready"; energetic black and lime with progress rings.
  - Budget: the hero asks 3 numbers → "$412 a month you can save" in clear, the breakdown blurred → "See where the money is" → sign-up → paywall; precise white and ink with tabular figures.

### The premium build (Kwop Builder and Pro): Budgeto at the level of Kwop's own SaaS
On top of everything above:
- A motion-design VSL right under the hero: 45 to 75 seconds, built in HTML/CSS/JS (no video file), 6 to 8 scenes that tell the story (the problem → the moment it clicks → Budgeto in action → the RESULT → what changes → the call to action), big captions, smooth transitions, muted autoplay with a button to replay it. Write VSL.md with a voice-over script the owner can record; public/vsl.mp4 replaces the motion VSL when it exists.
- A landing page like the best SaaS of the niche and like Kwop's own: the hero (the live product or the notification phone), the VSL, how it works with animated device frames, a short animated loop of each key feature, real proof (live counts from the database once they are worth showing, real reviews only), a comparison with the usual way, the questions, a sticky main button on phones.
- Motion everywhere, with taste: scroll-driven reveals, the niche's illustrations drawn in SVG and animated, transitions that keep the person's place, satisfying success moments, numbers that count up; prefers-reduced-motion respected.
- The unlock film after paying (section 6.6).
- Share-ready results: every RESULT gets a branded share image (next/og) and a "Share" button, so each user brings the next one.
- A premium pass before going online: typography, spacing, motion timing, dark mode, empty states, Lighthouse 95+ on the landing page.

#### The Kwop-grade kit: exact values, so Budgeto looks like kwop.io and not like a template
Keep this structure, these timings and this level of finish; take the colors, the fonts and the illustrations from Budgeto's own design direction (section 10), so it never looks like a copy of Kwop.
- Background: near-black (#060606) with a dot grid over the hero (radial-gradient(rgb(255 255 255/.2) 1px, transparent 1.5px), one dot every 22px, masked by an ellipse that fades out toward the sides and the bottom) and one soft glow at the top center. Light sections (#fafafa) alternate with dark ones to give the page a rhythm.
- Type: titles 52 to 80px on a computer and 40 to 50px on a phone, weight 600 to 700, letter-spacing −0.04em, line-height 1.02; the second line of a big title in a light-to-grey gradient; small labels in a mono font, UPPERCASE, letter-spacing 0.18em, between brackets ([ HOW IT WORKS ]).
- Top bar: a floating rounded card (radius 24px, at most 980px wide, centered, 14px from the top, translucent background with a blur, a 1px inner border at 9% white): the logo, 3 or 4 links, a small language menu if the app has two languages, Log in, the main button.
- The main button: a pill 60 to 68px tall, a soft glow behind it that slowly breathes (3.6 s), an arrow in a contrasting circle that nudges every 2.6 s and slides away on hover, a press-in to 95.5% on tap.
- Under the hero's button: real proof only. Round avatars of real users who said yes, or none, and one short mono line with a TRUE count from the database (« 1,200+ people already joined »), shown once it is worth showing. Never an invented number or face.
- The phone in the hero (personal flow): a realistic iPhone drawn in CSS (rounded frame, dynamic island, status bar, the live time, the lock-screen clock), Budgeto's own notifications sliding in with Kwop's timings (section 4).
- Reveals: each block rises 14px and fades in once, in 0.5 s with cubic-bezier(.22,.8,.24,1), its children staggered 60 ms apart; numbers count up in 1.3 s (ease-out); nothing moves when prefers-reduced-motion is on.
- The onboarding questions, like Kwop's quiz: one question per screen that types itself (18 ms a letter, a blinking caret), a plain list of answers with a small square tick on the left, the answer's line opening under the chosen answer like a drawer, a thin progress bar on top, « ← Previous question », a big white « Continue → » for multiple choices. One tap on a single choice moves on by itself after the line is read (1.3 s).
- The paywall, like Kwop's: the title says the RESULT is ready, then the plans as large cards (a radio, the name, the price a month, a crossed price ONLY when the discount is real, the price per day big on the right, « Most popular » on the middle one), a guarantee box if you offer one, the questions, and the same plans again at the very bottom under « Pick up where you left off » so nobody scrolls back up.
- Footer: the links in columns, then Budgeto's name as a giant faded wordmark (about 13% opacity, fading downward) across the full width at the very bottom.
- Check it like a designer: screenshots at 390px and 1440px of every section, then fix what looks cheap (uneven spacing, text too long, a weak contrast, a stiff animation) before you call it done.

## 4. The landing page ("/")
Logged-in users go straight to the app. Everyone else gets a short page built around Budgeto's magic moment, clear in 3 seconds. Use the model you picked in step 0 for the order of the sections, then apply these rules on top (if the model shows prices on its landing page, you don't).
- Top bar, sticky with a blurred background: the logo and the name on the left; "Log in" and a small main button on the right. Nothing else.
- The hero, as the blueprint decides:
  - Try first: the hero IS the product's first step, working for real. A title of 8 words max that says the RESULT (make this moment visible: « I found a $200 monthly subscription I forgot about in 5 seconds »), then the input right under it (the picker, the drop zone, the numbers, the 3 quick questions…), big and inviting, with an example ready to try in one tap. The teaser appears in place, without leaving the page.
  - Personal flow: the title (8 words max, the RESULT), one sentence with 2 words in bold, one big button (the main action + an arrow that nudges every few seconds), one line of true facts ("Free to try · No card · Ready in 60 seconds"), and on the right (under the button on a phone) the magic moment made visible: a realistic phone or browser frame built in HTML/CSS showing the RESULT, or this niche's notifications sliding in. Notifications, if you use them: Kwop's timings (the first 3 at 0 s, 0.9 s and 1.8 s, then one every 2.6 s; 3 visible on a computer, 2 on a phone; the older ones dim and "now" becomes "1m ago"; prefers-reduced-motion shows 3 still ones), the app's icon and name, one short line each, example values only.
- Under the hero: the motion-design VSL of the premium build (section 3).
- Then 4 or 5 short sections in the niche's words, one idea each, each with a visual of the real product (never a stock photo): the problem, how it works in 3 steps, the product in action (device frames, gently animated), what changes for them (true numbers), questions (5 or 6: the real doubts of people wanting to save more money; about the price: "You try it free first. The plans show up once your first RESULT is ready.").
- A final block that projects the result tonight, the main button again; a footer (logo, Terms, Privacy, Log in, © year). Never a price.
- Every main button leads into the funnel (to the hero's input in try first, to /signup in personal flow), keeping ?plan= and the utm_ parameters (cookie, then profiles.intended_plan and profiles.source).

## 5. Sign-up (the sheet, /signup and /login)
- A sign-up sheet over the result (try first) or a centered card on a calm background (personal flow): the logo; a headline in this niche's words that promises or saves the RESULT ("Save your prediction", "Sign up so Budgeto can create your RESULT"); "Continue with Google" (white, full width, the real Google G); a thin "or" divider; email; password with show/hide; the main button; "Already have an account? Log in"; one small line linking Terms and Privacy. Never a wall of fields.
- Supabase Auth: email + password with email confirmation OFF, and Google (step 5 of the build order). Until Google works, hide its button: never a broken button. A try made before sign-up is saved (a local id) and attached to the account at sign-up. Tries without an account are limited on the server (3 a day per device and per IP) so nobody can drain the AI or data budget.
- Errors in plain words under the field ("This email already has an account. Log in?"). "Forgot password" works. After sign-up the person lands exactly where they were: on their result (try first) or in the personal flow (personal flow). No welcome screen in between.

## 6. From the first action to the paywall to unlocked
6.1 The personal flow (personal-flow funnel; in try first, its questions can come after paying to tune the product): 3 to 6 questions built from the problems, the outcomes and the features above, one per screen: big tappable cards (icon + short label), a thin progress bar at the top, a back arrow, "Skip" only on optional ones. A single-choice tap moves on by itself (no "Next"). Reuse earlier answers in the wording of the next questions, so it feels personal. Save each answer at once (profiles.answers). Then the one input the RESULT needs (a text, a photo, a link…) on its own screen, with an example already filled in.
6.2 The work being done: the RESULT being made in front of them, in this product's own terms (the factors of a prediction, the scan of a photo, the parts of a plan, the scenes of a video): 4 to 6 named steps that tick one by one with a small animation, a percentage that counts up smoothly, the RESULT assembling softly behind. Really make the RESULT during this screen (the AI call, the data, the computation), as long as the real work needs (at least 3 seconds in try first, 6 in personal flow). Hold at 99 % while the work is not finished; if it fails, retry once, then a friendly message with "Try again". Then "Your RESULT is ready." with a short success animation. Track "onboarding_done".
6.3 The RESULT, locked: show it where it was made: the part that proves it is real in clear (the confidence of a prediction, the first lines, day 1, a low-resolution preview, one insight…), the rest blurred behind a soft gradient with a lock, and the unlock button in this niche's words. It is saved in the database: it waits for them.
6.4 The unlock button (sign-up first if they have no account yet) opens the paywall, as a sheet over the RESULT (full screen on a phone, a centered 480 px card on a computer), in Budgeto's own design. Top to bottom, with air between blocks, never crowded:
  - ✕ at the top left;
  - "Your RESULT is ready." in this niche's words, and one short personal line under it;
  - "Choose your plan." on the left, a small Monthly / Yearly switch on the right ("Yearly −20%"; hide the switch if no plan has a yearly price);
  - the plans as rows (radio cards), the recommended one pre-selected with "Most popular" on its border. Left: the plan name, its price per month (or per year) small under it, one short tag in the niche's words (who it is for). Right: the PRICE PER DAY, big ("$0.30" with "/ day" small). Per day = monthly price ÷ 30, yearly price ÷ 365, 2 decimals (GET KWOP_API gives them);
  - one big button "Continue with <Plan>", and under it "$9.00 due today, then every month · Cancel anytime";
  - "Secure payment, processed by Whop" with small chips: Whop · Card (add Apple Pay only if it shows in the checkout during your test);
  - "What you unlock with <Plan>": 4 to 6 short lines with check icons, benefits in the niche's words, with the plan's quotas in the niche's units;
  - 3 questions that open on tap: the last doubts of this niche before paying (will it work for me, can I cancel, what happens right after paying);
  - small print: renews automatically until canceled, prices in USD.
  The same paywall also lives at /pricing for logged-in users (never linked from the landing page: checkout pages send people back there when they cancel). A copy of the button floats at the bottom of the sheet only while the real one is out of view. ✕ closes the sheet: the person sees their locked RESULT with a sticky bottom bar "<the unlock words> · <price a day>" that reopens the paywall; tapping any locked part reopens it too. Track "paywall_view" each time it opens.
6.5 The checkout, inside the page: "Continue" opens a second sheet over the paywall (a bottom sheet with a grab handle on a phone, a centered card on a computer), titled with the plan and its price, with Whop's checkout embedded in it. Client side, exactly like Kwop's own paywall:
    1. POST /api/checkout {plan, period} → your server reads the user's email (and their saved "k", the Kwop tracked link they came from) from the session and calls POST KWOP_API/checkout {"plan", "period", "email", "k"} → { embed, ref, fallback_url }. If embed is null, open fallback_url in the same tab.
    2. Load Whop's script once: <script src="https://cdn.whop.com/elements/amber/elements.js" data-whop-elements></script> (inject it, wait for its load event).
    3. const ck = window.WhopElements().checkout.create({ checkoutConfiguration: embed, returnUrl: location.origin + "/dashboard?paid=1&ref=" + ref, appearance: { theme: { appearance: "dark" or "light", like the app } }, onLoadingChange: (st) => { if ((st && typeof st === "object" ? st.loading : st) === false) show() }, onComplete: (r) => { if (r && r.result === "payment") unlock(ref) } });
    4. ck.create("checkout").mount("#whop-checkout"); show a "Loading secure checkout…" line until it is ready; if Whop's iframe is in the sheet but no loading event came, show it after 2 s; if nothing showed in 15 s, open fallback_url in the same tab. Closing the sheet (✕ or pull down) calls ck.destroy() and returns to the paywall.
    5. Under the checkout: "Secure payment by Whop · Cancel in 1 click".
  If KWOP_API/checkout answers 409 payments_off, show "Payments open in a moment. Your RESULT is saved." and keep the paywall: never an error page.
6.6 Unlocked: unlock(ref) → POST /api/checkout/confirm {ref} → your server calls POST KWOP_API/confirm {"ref"}, then getPlan(email) without cache. Then the unlock moment: full screen, 3 short scenes in 4 to 6 seconds ("You're on <Plan>" → what is now unlocked, 3 icons → "Let's go"), skippable with ✕; then the RESULT unblurs in place with a short animation. No reload, no email to check. Track "aha" (the first full RESULT). A buyer who comes back from the fallback page lands on /dashboard?paid=1&ref=…: confirm the same way and play the same moment.

## 7. Plans, quotas and upgrades
- My prices: I choose them once, with you, right after step 0 (the only question you ask me in this build). From what the apps of step 0 (YNAB, Copilot) and the market charge people wanting to save more money in the United States, send me 3 options in one short message, then wait for my answer:
  - A (a little under the market), B (at the market, usually the best) and C (premium). Each one: 3 plans named in Budgeto's words, a monthly price, what each plan gives (its quotas, in the niche's units) and the yearly price (Kwop always offers yearly at −20 % and computes it). Say in one line which one you recommend and why.
  - Today's plans in Kwop, a starting point (often too cheap):
  - Starter (Kwop plan id 1645): $5/month = $0.17 a day; yearly: $48/year ($0.13 a day, −20%). For quick monthly checks Includes: 10 statement scans per month, Basic category breakdown, Email support.
  - Pro (Kwop plan id 1646): $9/month = $0.30 a day; yearly: $86/year ($0.24 a day, −20%). Recommended: pre-select it, "Most popular". For serious monthly savers Includes: 30 statement scans per month, Deep hidden fee detection, Priority AI processing.
  - Power (Kwop plan id 1647): $19/month = $0.63 a day; yearly: $182/year ($0.50 a day, −20%). For maximum financial control Includes: 100 statement scans per month, Multi-bank comparison, Custom savings rules.
  - When I answer (a letter, or my own prices; "keep" keeps today's plans), save them in Kwop from this computer:
    curl -s -X POST "https://kwop.io/api/v2/app/<KWOP_KEY — see .env.local>/plans" -H "Content-Type: application/json" -d '{"code":"<plans code — see .env.local>","plans":[{"name":"<plan>","price_month":<the monthly price, a number>,"features":["<what it gives>"],"featured":<true for the recommended plan>}]}'
    2 to 4 plans, prices in USD. It answers the plans with their Kwop ids; if it answers an error, show me its message.
- Never hardcode a price or a plan id: the app reads the plans with GET KWOP_API (names, ids, prices, the price a day, yearly) and uses those ids for the checkout.
- Each plan answers one level of need, and the point of a plan is to make the next one wanted. Give each plan clear quotas of what Budgeto produces (RESULTS a month, credits per generation, export or video, projects, history…), counted on the server per billing period; the top plan is the biggest but still capped (no unlimited AI cost). Write the quotas in CLAUDE.md and show them in "What you unlock".
- Lower plans visibly miss something: a locked part shows its real preview blurred with "Unlock with <next plan>"; a finished quota shows the next plan.
- The upgrade sheet (a quota ends, a locked part is tapped, "Change plan"): the next plan only, what it adds in 3 lines, its price a day, one button → the same checkout inside the page. Once the upgrade is confirmed, POST KWOP_API/cancel {"email", "except_ref": "<the new ref>"}: the old plan stops at the end of its period, never two plans billed.
- Account → Billing: the current plan, its renewal date, "Change plan", "Cancel my subscription" (POST KWOP_API/cancel {"email"}, show its "message"; if it returns manage_url, show that link). Cancelling is always 2 taps away, never hidden.

## 8. Kwop = payments, plans and the owner's dashboard (no Whop code in this app)
Kwop takes the payments on my own Whop account and shows me the orders, the revenue and the funnel. This app never talks to Whop directly: its server only talks to Kwop.
- Secret, server side only: KWOP_API=https://kwop.io/api/v2/app/<KWOP_KEY — see .env.local>
  Put it in .env.local and in the Vercel environment. Never in browser code, never committed.
- GET KWOP_API → { name, checkout: "embedded" | "redirect" | null, plans: [{ id, name, price_cents, currency, interval, per_day, yearly: { price_cents, per_day } | null }] }
- POST KWOP_API/checkout {"plan": <plan id>, "period": "month" | "year", "email", "k"?} → { embed, ref, fallback_url }; 409 { error: "payments_off" } while my payments are not connected.
- "k" is the Kwop tracked link the buyer came from (my creators' links): my Kwop page sends people to <app>/signup?k=<code>. Keep it: on any page, if the URL has ?k= (letters and digits, up to 12), store it in a first-party cookie kwop_k (30 days, SameSite=Lax) and on the user's row at sign-up; send it as "k" in every KWOP_API/checkout call for that user. Never block or change anything if it is missing.
- POST KWOP_API/confirm {"ref"} → { ok, paid }.
- GET KWOP_API/plan?email=<email> → { paid, plan: { id, name } | null, status, until }. Server only, in one helper getPlan(email) in lib/kwop.ts, cached 60 s per email (skip the cache right after a payment). Never trust the browser for this. If Kwop does not answer, keep the last known plan and log the error.
- POST KWOP_API/cancel {"email"} (+ "except_ref" after an upgrade) → { message, manage_url? }.
- POST KWOP_API/event {"type", "email", "detail"?}, from the server, fire-and-forget (never block a page, never throw): "signup", "onboarding_done", "aha", "paywall_view", "feature_used" (detail = the feature's name).
- Once online: POST KWOP_API/connect {"url": "<the https production address, no trailing slash>"}: my Kwop page (https://kwop.io/budgeto, its buttons go to <app>/signup?plan=<plan name>) and my dashboard then use the app.
- Kwop's visit tracking, on the public pages only (landing page, sign-up, log-in; never inside the app): <script src="https://kwop.io/flow.js" data-site="s_5cdc0c337f" defer></script>. Say "visit analytics by Kwop" in /privacy.
- My payments are connected to Kwop, on my own Whop: KWOP_API/checkout creates every checkout on my Whop, in Budgeto's name and at the plan's price, and Whop pays me directly. Never ask me for a Whop key and never put one in the code.

## 9. The product after paying
- App shell: a sidebar on a computer, a bottom tab bar on a phone (4 tabs at most, plus Account). Menu: Dashboard, Upload, Leaks, Settings, Account (give every other feature above its place).
- The core feature "PDF Statement Scan" first, better than the competitors: fast, clear, a RESULT people want to share (a share or download button on every RESULT).
- Every feature: its own page, fully working (list, create, edit, delete), loading (skeletons), empty (one sentence + one button) and error states (plain words + "Try again"), comfortable at 390 px; paid parts checked with getPlan() on the server.
- Account: profile, plan and billing, language, "Delete my account" (with their data).
- /terms and /privacy: short and honest (data kept: email, answers, usage; payments by Whop through Kwop; services: Supabase, Vercel, and Google Gemini if used).
- Outside data, if the RESULT needs it (fixtures and stats, prices, places, weather…): a reliable source with a free plan, called from the server and cached. Ask me for its free key at the very start, in one line with the link, like the Gemini key; never ship made-up data.
- AI, if the RESULT needs it: one file, lib/ai.ts, Google Gemini (GEMINI_API_KEY, the newest Gemini Flash model; it reads text, PDFs and images), counted against each plan's quota on the server. Ask me for the key AT THE VERY START, in one line: "Open https://aistudio.google.com/apikey, create a free key and paste it here." Keep building while you wait, then put it in .env.local and in Vercel: the RESULT must really work at the first test.
- Installable on a phone: a web app manifest and icons made from the logo.

## 10. Design: the bar is "the best-designed app of this niche", never a template, never "vibe-coded"
- The visual direction of section 3, made precise in the blueprint: its two fonts (next/font, Google Fonts), its colors (main color #C8FF3D unless the direction says otherwise), its signature elements. Headings tight (-0.02em), a clear type scale (hero 56 to 64 px on a computer, 38 to 44 px on a phone), a lot of air (sections 96 to 128 px apart on a computer, 64 px on a phone), max width 1120 px. Light and dark modes when the niche suits both.
- Premium is in the details: visuals of THIS niche built in code (a scoreboard, a scan frame, a plan timeline, a waveform…), real micro-interactions (pressed states, a satisfying success moment, numbers that count up), transitions that keep the person's place between steps, skeletons instead of spinners.
- shadcn/ui and lucide icons (never emojis as icons), radius 14 to 20 px, soft 1 px borders, soft shadows, a 4/8 px spacing grid, hover and pressed states on everything clickable, visible focus for the keyboard.
- Motion with framer-motion: reveal on scroll (opacity + 12 px rise, 450 ms, staggered), sheets with spring physics, numbers that count up, nothing jumpy, prefers-reduced-motion respected.
- Visuals: the real interface built in code (device frames, product screens, live-looking data). Never stock photos, never lorem ipsum, never fake logos.
- Copy: short and concrete, in English, for people wanting to save more money in the United States: their words, their references. A 12-year-old understands every sentence.
- Speed: Lighthouse mobile 90+ on the landing page, no layout shift, fonts and images optimized.
- SEO: a title and a description per page, an Open Graph image (next/og) showing the RESULT, the favicon from the logo.

## 11. The verification loop, after EVERY feature (not optional)
1. Run it (npm run dev). If your Claude app has a browser preview (the Browser pane), add .claude/launch.json for "npm run dev" on port 3000 and open it there, so I can watch you test it live. Otherwise use Playwright (npx playwright install chromium) with a script scripts/shot.mjs that saves full-page screenshots at 390×844 and 1440×900.
2. Use it like a new user, click by click, on a phone size and on a computer size. Look at every screenshot yourself (open the image files): anything cut, overlapping, misaligned, unreadable, ugly, empty or in the wrong language is a bug.
3. Check the browser console (zero errors) and the server logs.
4. Fix, then check again. Three passes, then commit and move on.
5. Keep one end-to-end test, tests/e2e.spec.ts (Playwright), of the blueprint's whole funnel as a brand-new visitor: landing page → the first action → the work → RESULT locked → sign-up (a new email) → paywall → the checkout sheet opens (never pay) → close → account. Run it 3 times on a phone size and a computer size before every deploy: everything must work for real.

## 12. Tech stack (fixed)
Next.js (App Router, TypeScript) + Tailwind CSS + shadcn/ui + framer-motion + lucide-react. Supabase: Postgres + Auth, Row Level Security on every table (a user only sees and changes their own rows), SQL in supabase/migrations. Hosting: Vercel, free plan. AI only through lib/ai.ts.

## 13. Do it in this order, without stopping
0. Copy what already converts, before writing any code. With web search, open the 3 best SaaS that already do what Budgeto does for people wanting to save more money (start with YNAB and Copilot), in the United States first. For each, write in CLAUDE.md: its landing page (headline, sections in order, the button's words), its sign-up, the steps to the first result, where the paywall appears, its plans (price, what each adds, the limits). Pick the best one as the model for structure and flow, then apply sections 2 to 7 on top. Never copy their brand, logo, text, images or code.
   Step 0b: write Budgeto's blueprint in CLAUDE.md (section 3), concrete to the product, before any code.
   Step 0c: my prices (section 7): send me the 3 options, wait for my answer, save them in Kwop, then go on without stopping.
1. Check that Node.js 20+ and git work (node -v, git --version). If one is missing, install it yourself (macOS: Homebrew if present, otherwise the official installer; Windows: winget). Tell me only what to click if the system asks.
2. Write CLAUDE.md at the root: everything in this message, the blueprint, the RESULT, the quotas of each plan, your design choices, the Kwop API, the verification loop, so every future session knows the project. Create .env.example with the variable names. git init, commit after each working step.
3. The design system first, from the blueprint's visual direction: tokens (colors, fonts, spacing, radius), the base components, the niche's signature elements, the device frames the landing page needs, the sheet. Verification loop.
4. The landing page (section 4), with the hero the blueprint decided (in try first, the first action works for real on it), with the motion VSL. Verification loop.
5. Supabase with its CLI (npx supabase): login (a window opens for me), create the project "budgeto" in the region closest to the US with a strong generated database password (saved in .env.local), link it, push the migrations, and with the Supabase Management API (PATCH /v1/projects/{ref}/config/auth): mailer_autoconfirm true (no email confirmation), site_url, uri_allow_list. If a CLI command is missing in this version, use the Management API with the token from the login. Put the keys in .env.local.
   Google sign-in, while you keep building: send me ONE message with these steps and the exact address to paste: (1) open https://console.cloud.google.com/auth/overview, sign in, create a project named Budgeto if asked, click Get started: app name Budgeto, my email, Audience External, accept; (2) open https://console.cloud.google.com/auth/clients → Create client → Web application → Authorized redirect URIs: https://<project-ref>.supabase.co/auth/v1/callback → Create; (3) paste the Client ID and the Client secret here; (4) open https://console.cloud.google.com/auth/audience and click Publish app. When I paste them, turn Google on with the Supabase Management API (PATCH /v1/projects/{ref}/config/auth: external_google_enabled, external_google_client_id, external_google_secret) and test it.
6. Sign-up: the sheet, /signup and /login (section 5). Verification loop.
7. The blueprint's funnel, from the first action to unlocked (section 6), with lib/kwop.ts. Verification loop: the Whop checkout must open inside the sheet (never pay).
8. The product (section 9): the core feature, every other feature, the quotas, the upgrade sheets, account, billing, cancel, legal pages. Verification loop for each.
9. npm run build and npm run lint with zero errors, the end-to-end test green.
   9b. The premium pass (section 3): the share images, the unlock film, then typography, spacing, motion timing, dark mode and empty states on every page; Lighthouse 95+ on the landing page; the end-to-end test again.
10. Vercel with its CLI (npx vercel): login (a window opens for me), create the project "budgeto", add every environment variable for production, deploy to production. Then set the Supabase site URL and redirect URLs to the production address (and keep the Google redirect), and redeploy if needed.
11. Test the live address like section 11, with a new email, on a phone size and a computer size: the full journey until the checkout sheet. Then connect it: POST KWOP_API/connect with the production address (the stable https://<project>.vercel.app one), check the answer says ok, and check that https://kwop.io/budgeto/app opens the app.
12. Security pass: RLS on every table (try to read another user's rows: it must fail), every paid route checked with getPlan() on the server, KWOP_API and the service keys never in browser code (search the build output), input validation on every API route, no white screen (error.tsx, not-found.tsx).

## The final message to me (and nothing before it)
In English, 6 lines max: "Budgeto is online: <address>", "It is connected to Kwop: your page's buttons, your payments and your dashboard now use it", the test account you used, the quotas you set for each plan, anything still "Coming soon" and why (for example the Gemini key or Google sign-in: then give me the one link and add it yourself when I paste it), and: "Back to Kwop → Build my software to see your numbers."