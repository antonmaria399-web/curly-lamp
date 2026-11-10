/**
 * Budgeto's go-to-market content (mirrors GROWTH.md). Used by /admin (Scripts, Messages) and /creators.
 * {rate}, {cap}, {link}, {name} are filled in at display time.
 */

export type Format = {
  key: string;
  name: string;
  why: string;
  beats: { t: string; show: string; text: string }[];
  keyword: string;
  hooks: string[];
};

export const FORMATS: Format[] = [
  {
    key: "audit",
    name: "The 5-second money audit",
    why: "The most repeated shape in subscription-app videos: a person, a phone, a number that hurts. The number is the hook.",
    beats: [
      { t: "0–2 s", show: "Face to camera, phone in hand, the bank app open.", text: "I found a $200 monthly subscription I forgot about in 5 seconds" },
      { t: "2–6 s", show: "Download the statement PDF from the bank app (real taps, fast).", text: "Step 1: download last month's statement" },
      { t: "6–12 s", show: "Drop it into Budgeto: the scan line sweeps, the % climbs.", text: "Step 2: drop it in (no bank login)" },
      { t: "12–18 s", show: "The leak list appears. Zoom on the total per month.", text: "$___ a month. On things I don't use." },
      { t: "18–25 s", show: "Cancel one live (Settings → Subscriptions), tap 'I cancelled it' in Budgeto, saved counter goes up.", text: "Cancelled 3. That's a car payment a year." },
      { t: "25–30 s", show: "Back to face.", text: "Comment LEAKS and I'll send you the link" },
    ],
    keyword: "LEAKS",
    hooks: [
      "I found a $200 monthly subscription I forgot about in 5 seconds",
      "My bank statement was hiding $61 a month from me",
      "POV: you finally read your bank statement",
      "I was paying for 3 streaming apps I never open",
      "This is why you're broke every month (it's not coffee)",
      "I checked my statement for 5 seconds and cancelled $94",
      "Your bank won't tell you about this fee",
      "Things I forgot I was paying for, ranked",
      "I let an AI read my bank statement. It was rude.",
      "The $14.99 you forgot about costs you $180 a year",
    ],
  },
  {
    key: "challenge",
    name: "The no-spend reset (A to B)",
    why: "Money-reset and no-spend challenge videos are a native format on FinTok: the creator goes from 'broke at the end of the month' to 'found money', and the app is one step of the plan, never the whole video.",
    beats: [
      { t: "0–2 s", show: "Empty wallet / low balance on screen (blur the numbers you don't want to show).", text: "Day 1 of fixing my money before payday" },
      { t: "2–8 s", show: "Writing 3 steps on paper: 1. find leaks 2. cancel 3. move the money.", text: "The plan: find the leaks first" },
      { t: "8–15 s", show: "Budgeto scan of the statement, the leak list.", text: "Step 1 took 5 seconds" },
      { t: "15–22 s", show: "Cancelling 2 subscriptions, moving that amount to savings in the bank app.", text: "Step 2 + 3: cancel, then move it to savings" },
      { t: "22–28 s", show: "The Budgeto saved counter and goal ring.", text: "+$___ a month. Same paycheck." },
      { t: "28–30 s", show: "Face.", text: "Comment RESET for the app" },
    ],
    keyword: "RESET",
    hooks: [
      "Day 1 of fixing my money before payday",
      "How I found $100 a month without a side hustle",
      "Money reset: the first thing I do every month",
      "I gave myself 10 minutes to fix my budget",
      "Paycheck to paycheck? Do this before you budget",
      "The boring money habit that paid my phone bill",
      "Month 1 of saving $1,000: step one",
      "You don't need a budget. You need to see your leaks.",
      "Before you open a high-yield savings account, do this",
      "I stopped 4 charges today. Here's how I found them",
    ],
  },
  {
    key: "reaction",
    name: "Reacting to a real statement",
    why: "Reaction and 'roast my spending' videos travel well because the viewer compares with their own statement. Budgeto is the tool that reads it in the video.",
    beats: [
      { t: "0–2 s", show: "Green-screen over a (blurred, anonymised) statement or the sample statement.", text: "Rating my follower's bank statement" },
      { t: "2–10 s", show: "Scroll the raw statement: codes like APPLE.COM/BILL, ADOBE *CREATIVE CLD.", text: "6 pages of codes. Where's the leak?" },
      { t: "10–18 s", show: "Run Budgeto on it: the scan, then the list.", text: "Let the AI read it" },
      { t: "18–26 s", show: "React to the top 3 leaks, explain each in one line.", text: "This one renews yearly. Sneaky." },
      { t: "26–30 s", show: "Face.", text: "Send me yours: comment SCAN" },
    ],
    keyword: "SCAN",
    hooks: [
      "Rating my follower's bank statement",
      "Roasting my own bank statement (it's bad)",
      "Find the forgotten subscription in this statement",
      "This statement has 6 leaks. Can you spot them?",
      "What's actually on a $3,000 paycheck statement",
      "Reading my bank statement so you don't have to",
      "This 'monthly service fee' is optional. Here's why",
      "The subscription everyone forgets (it's on yours too)",
      "I asked an AI to find my wasted money",
      "Bank statement red flags, explained in 30 seconds",
    ],
  },
];

export type Message = { key: string; title: string; text: string };

export const MESSAGES: Message[] = [
  {
    key: "first_dm",
    title: "1. The first DM (no price, no link)",
    text: "Hey {name}! Loved your video about [one real detail from their profile]. I make Budgeto, an app that finds forgotten subscriptions in a bank statement. Paid video collab for your account? Scripts provided.",
  },
  {
    key: "reply",
    title: "2. The reply once they answer",
    text: "Awesome! How it works: you post short videos with Budgeto as one step of your money routine. Pay is ${rate} per 1,000 views (up to ${cap} per video), paid every Monday, plus a share of the sales you bring with your own link. Two formats that work: the 5-second money audit and the no-spend reset. Apply here (1 minute): {link}/creators",
  },
  {
    key: "side_income",
    title: "3. The side-income post (story + video)",
    text: "I pay people to post short videos about my app. No followers needed. Comment CREATOR.",
  },
  {
    key: "accepted",
    title: "4. Accepted",
    text: "You're in, {name}! Your link: {ref_link}\n\nFormats: (1) The 5-second money audit, (2) The no-spend reset. Scripts: {link}/creators\n\nYour first 10 videos: the same script, a different hook each time (hooks are in the scripts).\n\nThe 200-view rule: under 200 views after 2 hours, the hook failed. Post a new version with another hook. Over 1,000, make 2 more versions of that one.\n\nPayday: every Monday. Send me your video links + views by Sunday night. ${rate} per 1,000 views, up to ${cap} per video.",
  },
];

export const EXAMPLE_SCRIPTS = [
  {
    title: "The 5-second money audit",
    lines: [
      "Hook (on screen): I found a $200 monthly subscription I forgot about in 5 seconds",
      "Download last month's statement PDF from your bank app.",
      "Drop it into Budgeto. No bank login.",
      "Show the leak list and the monthly total.",
      "Cancel one for real, tap 'I cancelled it'.",
      "Close: Comment LEAKS and I'll send you the link.",
    ],
  },
  {
    title: "The no-spend reset",
    lines: [
      "Hook: Day 1 of fixing my money before payday",
      "Write the plan: find leaks, cancel, move the money.",
      "Step 1 in Budgeto: the scan takes seconds.",
      "Cancel two, move that amount to savings.",
      "Show the saved counter going up.",
      "Close: Comment RESET for the app.",
    ],
  },
];
