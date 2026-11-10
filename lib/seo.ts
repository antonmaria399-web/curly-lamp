/** Content for the SEO pages: /for/<audience> and /vs/<competitor>. Verifiable facts only. */

export type Audience = {
  slug: string;
  short: string;
  title: string; // ≤ 60 chars
  h1: string;
  h1b: string;
  intro: string;
  pains: string[];
  /** Example leak report (labelled as an example on the page). */
  example: { merchant: string; amount: number; cadence: string; why: string }[];
  tip: string;
};

export const AUDIENCES: Audience[] = [
  {
    slug: "students",
    short: "Students",
    title: "Find forgotten subscriptions on a student budget",
    h1: "Student budget?",
    h1b: "Find the subscriptions eating it.",
    intro: "Free trials from move-in week, a music plan you never switched to the student price, an app you used for one exam. Drop your statement PDF and see every recurring charge in seconds.",
    pains: ["Free trials that quietly turned paid", "Paying full price where a student plan exists", "Several streaming apps for one show each"],
    example: [
      { merchant: "Spotify Premium", amount: 11.99, cadence: "monthly", why: "Full price: a student plan exists" },
      { merchant: "Chegg Study", amount: 15.95, cadence: "monthly", why: "Still billing after finals" },
      { merchant: "Max", amount: 16.99, cadence: "monthly", why: "Recurring, same amount every month" },
    ],
    tip: "Check if your music and video apps have a student price: it is often about half.",
  },
  {
    slug: "families",
    short: "Families",
    title: "Family budget: find duplicate subscriptions fast",
    h1: "Family budget?",
    h1b: "Spot the double subscriptions.",
    intro: "Two people, two cards, the same streaming app paid twice. Kids' games, cloud storage on three phones. Scan each statement and see what repeats across the house.",
    pains: ["The same service paid on two cards", "In-app purchases that renew every month", "Cloud storage plans on every phone"],
    example: [
      { merchant: "Disney+", amount: 13.99, cadence: "monthly", why: "Also on the other card's statement" },
      { merchant: "Apple.com/bill", amount: 9.99, cadence: "monthly", why: "App subscription inside an Apple charge" },
      { merchant: "Google One", amount: 2.99, cadence: "monthly", why: "Recurring, small and easy to forget" },
    ],
    tip: "Most streaming and storage plans have a family option: one plan instead of two.",
  },
  {
    slug: "freelancers",
    short: "Freelancers",
    title: "Freelancers: find software subscriptions you forgot",
    h1: "Freelancer?",
    h1b: "Your tools are billing you twice.",
    intro: "Design tools, schedulers, domains, a course from last year. Freelance statements fill up with software. Budgeto lists every recurring charge so you keep the tools that pay for themselves.",
    pains: ["Two tools that do the same job", "Yearly renewals you didn't see coming", "Trials from client projects that ended"],
    example: [
      { merchant: "Adobe Creative Cloud", amount: 59.99, cadence: "monthly", why: "Recurring, the biggest one on the statement" },
      { merchant: "Calendly", amount: 12, cadence: "monthly", why: "Recurring, same amount every month" },
      { merchant: "Squarespace", amount: 192, cadence: "yearly", why: "Yearly renewal: $16 a month" },
    ],
    tip: "Yearly renewals hurt the most because you forget them: Budgeto shows them per month too.",
  },
  {
    slug: "couples",
    short: "Couples",
    title: "Couples: see every shared subscription in one place",
    h1: "Sharing money?",
    h1b: "See every subscription, both cards.",
    intro: "Scan both statements and get one honest list: what you both pay for, what only one of you uses, and what nobody opens anymore. No bank login for either of you.",
    pains: ["Not knowing what the other card pays for", "Duplicate streaming and music plans", "Gym memberships nobody uses"],
    example: [
      { merchant: "Netflix", amount: 15.49, cadence: "monthly", why: "Same service on both statements" },
      { merchant: "Planet Fitness", amount: 24.99, cadence: "monthly", why: "Recurring membership" },
      { merchant: "HelloFresh", amount: 71.92, cadence: "weekly", why: "Weekly charge, about $311 a month" },
    ],
    tip: "One shared plan instead of two personal ones usually saves the cost of one.",
  },
  {
    slug: "paycheck-to-paycheck",
    short: "Paycheck to paycheck",
    title: "Living paycheck to paycheck? Find your money leaks",
    h1: "Paycheck to paycheck?",
    h1b: "Start with the leaks, not a budget.",
    intro: "Before you build a budget, see what leaves your account on its own every month. Budgeto reads your statement PDF and adds up the recurring charges and fees.",
    pains: ["Overdraft and monthly service fees", "Small charges that add up", "No time for budgeting apps"],
    example: [
      { merchant: "Overdraft fee", amount: 35, cadence: "monthly", why: "Bank fee: often waived if you ask" },
      { merchant: "Monthly service fee", amount: 12, cadence: "monthly", why: "Bank fee: avoidable with direct deposit" },
      { merchant: "Hulu", amount: 17.99, cadence: "monthly", why: "Recurring, same amount every month" },
    ],
    tip: "Many banks waive the monthly service fee with a direct deposit or a minimum balance. Ask.",
  },
  {
    slug: "retirees",
    short: "Retirees",
    title: "Retirees: find recurring charges on your statement",
    h1: "On a fixed income?",
    h1b: "Know every charge that repeats.",
    intro: "Magazine renewals, an old phone protection plan, a membership from years ago. Budgeto reads the PDF statement your bank already gives you and lists every recurring charge in plain words.",
    pains: ["Auto-renewals from years ago", "Charges with confusing names", "Protection plans that keep billing"],
    example: [
      { merchant: "Membership renewal", amount: 20, cadence: "yearly", why: "Yearly renewal" },
      { merchant: "Asurion phone protection", amount: 17, cadence: "monthly", why: "Recurring, check if you still need it" },
      { merchant: "Magazine auto-renew", amount: 29.99, cadence: "yearly", why: "Yearly renewal" },
    ],
    tip: "Confusing charge names are normal. Budgeto shows the merchant behind the code.",
  },
  {
    slug: "gig-workers",
    short: "Gig workers",
    title: "Gig workers: track subscriptions on an uneven income",
    h1: "Uneven income?",
    h1b: "Fixed charges hit hardest.",
    intro: "When pay changes every week, the charges that never change matter most. Budgeto shows what leaves your account every month, no matter what you earned.",
    pains: ["Fixed charges in slow weeks", "Apps and fees from each platform", "No time to read 6 pages of codes"],
    example: [
      { merchant: "DashPass", amount: 9.99, cadence: "monthly", why: "Recurring, same amount every month" },
      { merchant: "Instant transfer fees", amount: 4.5, cadence: "weekly", why: "Fee every cash-out: about $19 a month" },
      { merchant: "Phone plan add-on", amount: 10, cadence: "monthly", why: "Recurring add-on" },
    ],
    tip: "Instant cash-out fees are small but weekly. Standard transfers are often free.",
  },
  {
    slug: "new-grads",
    short: "New grads",
    title: "First paycheck? Find the subscriptions already on it",
    h1: "First real paycheck?",
    h1b: "See what already eats it.",
    intro: "New job, new apartment, new apps. A month later your statement is full of things you signed up for in a hurry. One scan shows the full list.",
    pains: ["Sign-ups from moving week", "Student prices that ended", "Delivery memberships"],
    example: [
      { merchant: "Amazon Prime", amount: 14.99, cadence: "monthly", why: "Student price ended" },
      { merchant: "Uber One", amount: 9.99, cadence: "monthly", why: "Recurring membership" },
      { merchant: "Peloton App", amount: 12.99, cadence: "monthly", why: "Recurring, same amount every month" },
    ],
    tip: "Check which student discounts ended at graduation: the price often jumps quietly.",
  },
];

export type Competitor = {
  slug: string;
  name: string;
  title: string;
  what: string;
  price: string;
  bestAt: string;
  rows: [string, string, string][]; // [question, them, Budgeto]
};

/** Facts as published by each company (checked Nov 2026; prices can change, see their site). */
export const COMPETITORS: Competitor[] = [
  {
    slug: "rocket-money",
    name: "Rocket Money",
    title: "Budgeto vs Rocket Money: subscriptions without a bank login",
    what: "A budgeting app that links your bank accounts and lists your subscriptions, with a Premium plan that can cancel some for you and negotiate bills.",
    price: "Free plan; Premium on a pay-what-you-want range (about $6 to $12 a month at the time of writing).",
    bestAt: "Ongoing tracking of linked accounts, cancellation concierge and bill negotiation.",
    rows: [
      ["Needs your bank login", "Yes, through a bank-linking service", "No: you upload a PDF statement"],
      ["Time to first list", "After linking and syncing", "Seconds after the upload"],
      ["Cancels for you", "Premium concierge for some services", "No: step-by-step cancel help, you stay in control"],
      ["Bank fees flagged", "Some", "Yes, with a script to ask for a refund"],
      ["Works on a paper statement photo", "No", "Yes, with the AI scan"],
    ],
  },
  {
    slug: "ynab",
    name: "YNAB",
    title: "Budgeto vs YNAB: find leaks before you budget",
    what: "A zero-based budgeting method and app: you give every dollar a job, with linked or manual accounts.",
    price: "$14.99 a month or $109 a year, with a free trial (at the time of writing).",
    bestAt: "Building a full, hands-on budget and changing your money habits over months.",
    rows: [
      ["Needs your bank login", "Optional (linked accounts) or manual entry", "No: a PDF statement"],
      ["Time to first insight", "Setup of accounts and categories", "Seconds"],
      ["Finds forgotten subscriptions", "If you review your transactions", "Automatically, first screen"],
      ["Manual work", "Assigning every dollar", "None"],
      ["Best for", "A complete budget", "Finding and stopping leaks fast"],
    ],
  },
  {
    slug: "copilot-money",
    name: "Copilot Money",
    title: "Budgeto vs Copilot Money: no bank link, any phone",
    what: "A design-led money tracker that links your accounts and categorizes spending, with investments and net worth.",
    price: "About $13 a month or $95 a year, with a free trial (at the time of writing).",
    bestAt: "Automatic tracking of every account, investments and net worth on Apple devices.",
    rows: [
      ["Needs your bank login", "Yes, linked accounts", "No: a PDF statement"],
      ["Android", "No native Android app", "Works in any phone browser"],
      ["Time to first insight", "After linking and syncing", "Seconds"],
      ["Finds forgotten subscriptions", "Recurring section after sync", "First screen, with cancel steps"],
      ["Best for", "Full money tracking", "Finding and stopping leaks fast"],
    ],
  },
];
