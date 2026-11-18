/**
 * Budgeto's go-to-market words, in one place: GROWTH.md, /admin → Scripts and Messages, /creators.
 * Example values only (labelled as such). Never a promise above CREATOR_RATE / CREATOR_CAP.
 */

export type Format = {
  id: string;
  name: string;
  why: string;
  keyword: string;
  beats: string[]; // second by second
  onScreen: string[];
  hooks: string[];
};

export const FORMATS: Format[] = [
  {
    id: "audit",
    name: "The 5-second subscription audit",
    why: "The most repeated format around Rocket Money, Emma and subscription trackers: a person adds up what they pay and reacts to the total.",
    keyword: "LEAKS",
    beats: [
      "0–2 s: face to camera, phone in hand, the hook as on-screen text.",
      "2–6 s: open the bank app, download last month's statement PDF (show the Download button, blur the account number).",
      "6–12 s: drop the PDF into Budgeto, the scan runs (screen recording: lime line, steps ticking).",
      "12–18 s: the first leak appears (\"Hulu $17.99/mo\"); react.",
      "18–25 s: the total per month and per year; say what you'll do with it (vacation, debt, savings).",
      "25–30 s: cancel one on camera. End line: \"Comment LEAKS and I'll send you the link.\"",
    ],
    onScreen: ["I haven't watched Hulu since March", "the total made me sick", "cancelled 3 in 2 minutes"],
    hooks: [
      "I found a $200 monthly subscription I forgot about in 5 seconds",
      "POV: you finally add up every subscription you pay",
      "My bank statement was hiding $61 a month from me",
      "I've been paying for a gym I quit in 2024",
      "Doing a subscription audit before payday",
      "This is how much I was leaking every month",
      "Never checked my statement like this before",
      "My boyfriend thought we didn't have subscriptions",
      "3 apps I forgot I was paying for",
      "Cancelling everything I don't use, live",
    ],
  },
  {
    id: "payday",
    name: "Payday reset (A → B, Budgeto is one step)",
    why: "Payday / paycheck-planning videos are a big money-tok format; the app is a natural step inside a routine, never a plain demo.",
    keyword: "PAYDAY",
    beats: [
      "0–2 s: \"Payday reset with me\" + paycheck amount on screen (round number, example).",
      "2–8 s: bills paid first (rent, phone) in a notes app or spreadsheet.",
      "8–15 s: \"Now the part everyone skips\": scan last month's statement in Budgeto.",
      "15–22 s: what it flagged: 2 subscriptions + 1 bank fee. Decide keep / cancel for each.",
      "22–28 s: move the freed-up money to savings (show the transfer screen, amounts only).",
      "28–32 s: \"Comment PAYDAY for the app I use.\"",
    ],
    onScreen: ["step 3: hunt the leaks", "found $38 I didn't know about", "moved it straight to savings"],
    hooks: [
      "Payday reset: the step that saved me $40 this month",
      "How I split my $2,000 paycheck (and found a leak)",
      "Doing my monthly money reset before I spend a dollar",
      "The 4 things I do every payday",
      "Payday routine for people who live paycheck to paycheck",
      "I check THIS before I pay any bill",
      "My payday reset found a fee my bank never told me about",
      "First payday of the month, let's clean it up",
      "Budget with me: $1,850 paycheck",
      "Everyone skips this payday step",
    ],
  },
  {
    id: "react",
    name: "Statement roast / reaction",
    why: "Talking-head reaction to a statement (stitches, \"rate my spending\"): high comments, easy to repeat with followers' statements.",
    keyword: "ROAST",
    beats: [
      "0–2 s: \"Send me your statement and I'll find your leaks\" (or a stitch of someone asking).",
      "2–10 s: green-screen over the (sample or consenting follower's, anonymised) statement.",
      "10–18 s: run it through Budgeto, point at each flagged charge.",
      "18–25 s: the total: \"that's a car payment a year\".",
      "25–30 s: \"Comment ROAST and I'll send you the free scan.\"",
    ],
    onScreen: ["Adobe AND Canva??", "the storage unit you emptied", "$412 a year in fees"],
    hooks: [
      "Roasting your bank statements part 1",
      "You said you don't have subscriptions. Your statement says otherwise",
      "Rate this person's subscriptions",
      "I let AI read my bank statement",
      "Things on your statement you should cancel today",
      "Your bank is charging you for this",
      "If you have these 3 charges, cancel them",
      "Reading my followers' statements (with permission)",
      "What a $14/month leak costs you in 5 years",
      "This one fee is on half the statements I see",
    ],
  },
];

export const SCRIPTS_EXAMPLE = [
  {
    title: "Script 1 · The 5-second audit (30 s)",
    lines: [
      "Hook (on screen + said): \"I found a $200 monthly subscription I forgot about in 5 seconds.\"",
      "Show: download last month's PDF statement from your bank app.",
      "Show: drop it in Budgeto. The scan runs.",
      "Say: \"No bank login, it just reads the PDF.\"",
      "Show: the first leak + the total. React honestly to YOUR number.",
      "End: \"Comment LEAKS and I'll send you the link.\"",
    ],
  },
  {
    title: "Script 2 · Payday reset (35 s)",
    lines: [
      "Hook: \"Payday reset: the step that saved me money this month.\"",
      "Show: your bills going out first (no account numbers).",
      "Say: \"Now the step everyone skips: hunting the leaks.\"",
      "Show: Budgeto scanning last month's statement, then what it flagged.",
      "Show: cancel one, move that amount to savings.",
      "End: \"Comment PAYDAY for the app.\"",
    ],
  },
];

export const MESSAGES = (o: { rate: number; cap: number; site: string }) => [
  {
    id: "dm1",
    title: "First DM (no price, no link)",
    text: "Hey {first name}! Loved your {one real detail from their profile, e.g. \"payday reset\" video}. Paid video collab for your account? Scripts provided.",
  },
  {
    id: "dm2",
    title: "Reply once they answer",
    text: `Awesome! It's for Budgeto, an app that finds forgotten subscriptions from a bank statement PDF in seconds. Pay: $${o.rate} per 1,000 views (up to $${o.cap} per video), paid every Monday, plus a share of the sales you bring with your own link. Two formats that work: "the 5-second subscription audit" and "payday reset". Apply here and you'll get both scripts + your link: ${o.site}/creators`,
  },
  {
    id: "post",
    title: "Side-income post (story + video)",
    text: "I pay people to post short videos about my app. No followers needed. Comment CREATOR.",
  },
  {
    id: "accepted",
    title: "Accepted",
    text: `You're in! Here's how it works:\n1. Two formats: "the 5-second subscription audit" and "payday reset" (scripts below).\n2. Post your first 10 videos on the SAME script, only the hook changes.\n3. Your own link: {their link}. Put it in your bio, it credits every sign-up and sale to you.\n4. The 200-view rule: under 200 views after 2 hours, the hook failed: post it again with a new hook. Over 1,000: make 2 more versions of it.\n5. Payday is every Monday: send me your video links + views by Sunday night. $${o.rate} per 1,000 views, max $${o.cap} per video.`,
  },
];

export function welcomeMessage(o: { name: string; link: string; rate: number; cap: number }) {
  return `Hi ${o.name.split(" ")[0]}, you're in the Budgeto creator program!

Your link: ${o.link}
Put it in your bio: every sign-up and sale through it is credited to you.

Pay: $${o.rate} per 1,000 views, up to $${o.cap} per video, every Monday (send your links + views by Sunday night), plus a share of the sales your link brings.

${SCRIPTS_EXAMPLE.map((s) => s.title + "\n" + s.lines.map((l) => "- " + l).join("\n")).join("\n\n")}

Rules that make it work:
- Your first 10 videos on the same script, only the hook changes.
- Under 200 views after 2 hours = the hook failed: repost with a new hook. Over 1,000 = make 2 more versions.
- Show YOUR real numbers (or the sample statement, said as a sample). No account numbers on screen.

Hooks to start with:
${FORMATS[0].hooks.slice(0, 5).map((h) => "- " + h).join("\n")}

Welcome aboard!`;
}
