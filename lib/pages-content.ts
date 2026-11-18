/**
 * Free traffic from Google: one page per audience (/for/<slug>) and one honest comparison per competitor (/vs/<slug>).
 * Example leaks are examples (labelled on the page). Competitor facts: their public pricing pages, checked Nov 2026.
 */

export type ExampleLeak = { merchant: string; monthly: number; note: string };

export type Audience = {
  slug: string;
  label: string; // "College students"
  title: string; // <title>
  description: string;
  h1: string; // ≤ 8 words
  h1b: string; // gradient second line
  sub: string;
  pains: { t: string; d: string }[];
  example: { file: string; leaks: ExampleLeak[] };
  faq: { q: string; a: string }[];
};

export const AUDIENCES: Audience[] = [
  {
    slug: "college-students",
    label: "College students",
    title: "Find forgotten subscriptions on a student budget",
    description: "Free trials that turned into charges, two music apps, a gym you never go to. Drop your bank statement PDF and Budgeto lists every one in seconds.",
    h1: "Free trials don't stay free.",
    h1b: "Find the ones that didn't.",
    sub: "Upload the statement PDF from your bank app. Budgeto flags every recurring charge, from the student plan that ended to the app you signed up for during finals.",
    pains: [
      { t: "Student discounts expire", d: "Spotify, Hulu and Amazon student pricing ends quietly, and the full price starts the next month." },
      { t: "Trials you forgot", d: "A 7-day trial for a study app is a yearly charge by spring break." },
      { t: "Small, so invisible", d: "$4.99 here, $9.99 there. On a $600 budget, that's a week of groceries." },
    ],
    example: {
      file: "student_checking_oct.pdf",
      leaks: [
        { merchant: "Quizlet Plus", monthly: 7.99, note: "renewed after a free trial" },
        { merchant: "Spotify Premium", monthly: 11.99, note: "student price ended" },
        { merchant: "Planet Fitness", monthly: 15.0, note: "billed monthly" },
        { merchant: "Overdraft fee", monthly: 35.0, note: "bank fee" },
      ],
    },
    faq: [
      { q: "My bank is a credit union. Does it work?", a: "Yes. Any bank or card that gives you a PDF statement works, and a clear photo of a paper statement works too." },
      { q: "Do I need to link my bank?", a: "No. You upload the PDF you already have. Budgeto never asks for your bank password." },
    ],
  },
  {
    slug: "couples",
    label: "Couples",
    title: "Find duplicate subscriptions you both pay for",
    description: "Two Netflix accounts, two Amazon Primes, a streaming bundle on each card. Scan each statement and Budgeto shows what you're paying twice.",
    h1: "You might both be paying for Netflix.",
    h1b: "Find out in 5 seconds.",
    sub: "Scan your statement, then your partner's. Budgeto lists every subscription on each, so the doubles jump out.",
    pains: [
      { t: "Doubles after moving in", d: "Two Prime memberships, two Spotify plans, two cloud storage plans: one family plan would do." },
      { t: "Nobody owns the list", d: "Each of you signed up for something. No one has the full picture." },
      { t: "Money talks, without the fight", d: "A list of charges is easier to talk about than \"you spend too much\"." },
    ],
    example: {
      file: "joint_checking_sep.pdf",
      leaks: [
        { merchant: "Netflix", monthly: 17.99, note: "also on the other card" },
        { merchant: "Amazon Prime", monthly: 14.99, note: "2 memberships" },
        { merchant: "iCloud+ 200 GB", monthly: 2.99, note: "billed monthly" },
        { merchant: "Peacock", monthly: 7.99, note: "not used since the finale" },
      ],
    },
    faq: [
      { q: "Can we scan both statements?", a: "Yes. Scan one, then the other. Each report lists its own subscriptions." },
      { q: "Is my partner's statement stored?", a: "No statement file is ever stored. Only the leak report is saved, and you can delete it anytime." },
    ],
  },
  {
    slug: "families",
    label: "Families",
    title: "Find the kids' app subscriptions and family charges you forgot",
    description: "In-app subscriptions, game passes, streaming you added for one show. Budgeto reads your family's bank statement PDF and lists every recurring charge.",
    h1: "The kids' apps are billing you.",
    h1b: "Every month.",
    sub: "Game passes, learning apps, streaming for one show. Drop your statement PDF and see every recurring charge on one screen.",
    pains: [
      { t: "In-app subscriptions", d: "\"APPLE.COM/BILL\" can hide five different subscriptions." },
      { t: "Added for one show", d: "Disney+, Paramount+, Max: signed up for one series, still paying a year later." },
      { t: "No time to audit", d: "Nobody has a weekend to go line by line. Budgeto takes seconds." },
    ],
    example: {
      file: "family_checking_aug.pdf",
      leaks: [
        { merchant: "Roblox Premium", monthly: 9.99, note: "billed through Apple" },
        { merchant: "Disney+", monthly: 15.99, note: "billed monthly" },
        { merchant: "ABCmouse", monthly: 12.99, note: "renewed after a free trial" },
        { merchant: "Xbox Game Pass", monthly: 19.99, note: "billed monthly" },
      ],
    },
    faq: [
      { q: "Can it see what's inside APPLE.COM/BILL?", a: "Your statement only shows one line per Apple charge, so Budgeto flags each repeat amount and tells you where to see the list (Settings → your name → Subscriptions)." },
      { q: "Does it cancel them for me?", a: "No one gets access to your accounts. Budgeto gives you the exact steps to cancel each one yourself in a minute." },
    ],
  },
  {
    slug: "freelancers",
    label: "Freelancers",
    title: "Find software subscriptions eating your freelance income",
    description: "Design tools, AI tools, domain renewals, storage. Budgeto scans your business or personal statement PDF and flags every recurring charge and fee.",
    h1: "Your tools cost more than your rent.",
    h1b: "Maybe. Check in 5 seconds.",
    sub: "Adobe, Canva, two AI tools, a project app from an old client. Drop your statement PDF and see every recurring tool, monthly and yearly.",
    pains: [
      { t: "Tools from old projects", d: "That client wanted Figma seats. The project ended in March. The seats didn't." },
      { t: "Overlapping tools", d: "Canva and Adobe, Notion and Evernote, two AI subscriptions doing the same job." },
      { t: "Yearly renewals", d: "Domains and plugins renew once a year, when you least expect it." },
    ],
    example: {
      file: "business_checking_q3.pdf",
      leaks: [
        { merchant: "Adobe Creative Cloud", monthly: 59.99, note: "billed monthly" },
        { merchant: "Canva Pro", monthly: 15.0, note: "overlaps with Adobe" },
        { merchant: "Dropbox Plus", monthly: 11.99, note: "billed monthly" },
        { merchant: "Squarespace", monthly: 16.0, note: "yearly, shown per month" },
      ],
    },
    faq: [
      { q: "Does it work with a business account?", a: "Yes, if your bank gives you a PDF statement. It reads business and personal statements the same way." },
      { q: "Can I export the list?", a: "On the Pro and Power plans, you can export clean stat screens of your results." },
    ],
  },
  {
    slug: "gig-drivers",
    label: "Gig drivers",
    title: "Find the fees and subscriptions on a gig worker's statement",
    description: "Instant-pay fees, ATM fees, apps you don't need. Budgeto reads your bank statement PDF and lists every repeat charge and bank fee in seconds.",
    h1: "Instant pay isn't free.",
    h1b: "See what it costs you.",
    sub: "Cash-out fees, ATM fees, a phone app you tried once. Drop your statement PDF and see every fee and repeat charge, added up.",
    pains: [
      { t: "Fees on every cash-out", d: "A small fee each time adds up when you cash out every day." },
      { t: "ATM and account fees", d: "Out-of-network ATMs and \"monthly service\" fees, flagged with how to get them waived." },
      { t: "Irregular income", d: "When pay changes week to week, every fixed charge matters more." },
    ],
    example: {
      file: "checking_oct.pdf",
      leaks: [
        { merchant: "Instant transfer fees", monthly: 22.5, note: "repeat bank fee" },
        { merchant: "ATM fee (out of network)", monthly: 9.0, note: "bank fee" },
        { merchant: "Monthly service fee", monthly: 12.0, note: "can often be waived" },
        { merchant: "SiriusXM", monthly: 10.99, note: "renewed after a trial" },
      ],
    },
    faq: [
      { q: "Can it read a photo of my statement?", a: "Yes. A clear photo of each page works if you don't have the PDF." },
      { q: "Does Budgeto see my earnings app?", a: "No. It only reads the statement file you choose to upload." },
    ],
  },
  {
    slug: "retirees",
    label: "Retirees",
    title: "Check a bank statement for forgotten subscriptions, simply",
    description: "Magazine renewals, streaming, memberships and fees on a fixed income. Upload a bank statement PDF and Budgeto lists every repeat charge, in plain words.",
    h1: "Every charge, in plain words.",
    h1b: "No bank login needed.",
    sub: "Upload the PDF statement your bank emails you, or a photo of the paper one. Budgeto lists each repeat charge and how to stop it.",
    pains: [
      { t: "Renewals by mail", d: "Magazines, memberships and warranties renew themselves every year." },
      { t: "Hard-to-read codes", d: "Statements show codes, not names. Budgeto turns them into plain names." },
      { t: "Fixed income", d: "On a fixed budget, $30 a month you don't use is $360 a year." },
    ],
    example: {
      file: "statement_july.pdf",
      leaks: [
        { merchant: "AARP Membership", monthly: 1.67, note: "yearly, shown per month" },
        { merchant: "Magazine auto-renewal", monthly: 4.17, note: "yearly, shown per month" },
        { merchant: "Paramount+", monthly: 7.99, note: "billed monthly" },
        { merchant: "Paper statement fee", monthly: 2.0, note: "bank fee" },
      ],
    },
    faq: [
      { q: "Is it safe to upload my statement?", a: "The file is sent encrypted, read once and never stored. Budgeto can't move money or see your accounts." },
      { q: "Can a family member help?", a: "Yes. Anyone you trust can scan the PDF with you and go through the list together." },
    ],
  },
  {
    slug: "streaming",
    label: "Streaming",
    title: "How much do you really pay for streaming? Find out from your statement",
    description: "Netflix, Hulu, Max, Disney+, Peacock, YouTube Premium: Budgeto finds every streaming subscription on your bank statement PDF and adds them up.",
    h1: "Count every streaming app you pay.",
    h1b: "Then keep two.",
    sub: "Drop your statement PDF. Budgeto lists every streaming charge, the monthly total, and how to cancel each one.",
    pains: [
      { t: "Price hikes", d: "Streaming prices went up again this year. Your renewals followed." },
      { t: "Signed up for one show", d: "The show ended. The subscription didn't." },
      { t: "Bundles and add-ons", d: "Ad-free upgrades, sports add-ons, channels inside other apps." },
    ],
    example: {
      file: "card_statement_oct.pdf",
      leaks: [
        { merchant: "Netflix Standard", monthly: 17.99, note: "billed monthly" },
        { merchant: "Hulu", monthly: 18.99, note: "not watched since spring" },
        { merchant: "YouTube Premium", monthly: 13.99, note: "billed monthly" },
        { merchant: "Peacock Premium", monthly: 10.99, note: "renewed after a trial" },
      ],
    },
    faq: [
      { q: "Can Budgeto tell which ones I watch?", a: "No app on the web can see that. It flags every streaming charge, and you tap \"I still use it\" or \"I cancelled it\"." },
      { q: "Will it find yearly plans?", a: "Yes, if the yearly charge is on the statement you upload. It shows it per month too." },
    ],
  },
  {
    slug: "bank-fees",
    label: "Bank fees",
    title: "Find hidden bank fees on your statement (overdraft, ATM, service)",
    description: "Overdraft, ATM, monthly maintenance and paper-statement fees. Budgeto reads your bank statement PDF, flags each fee and gives you a script to get it waived.",
    h1: "Your bank charges you to be a customer.",
    h1b: "Find every fee.",
    sub: "Monthly service fees, overdrafts, out-of-network ATMs, paper statements. Drop your statement PDF and see each fee with how to get it waived.",
    pains: [
      { t: "Monthly service fees", d: "Many accounts waive them with direct deposit or a minimum balance. Most people never ask." },
      { t: "Overdrafts", d: "One late payment can mean several overdraft fees in a single day." },
      { t: "ATM fees, twice", d: "Your bank charges you, and so does the ATM's owner." },
    ],
    example: {
      file: "checking_sep.pdf",
      leaks: [
        { merchant: "Monthly maintenance fee", monthly: 12.0, note: "often waived with direct deposit" },
        { merchant: "Overdraft fee", monthly: 35.0, note: "ask for a courtesy refund" },
        { merchant: "Non-network ATM fee", monthly: 6.0, note: "bank fee" },
        { merchant: "Paper statement fee", monthly: 2.0, note: "switch to e-statements" },
      ],
    },
    faq: [
      { q: "Can Budgeto get my fees refunded?", a: "It gives you the words to ask your bank. Many banks refund a first overdraft or waive a service fee when you ask." },
      { q: "Which plan finds fees?", a: "Every report shows how many fees were found. The full fee list with waive scripts is in the Pro and Power plans." },
    ],
  },
];

export type Competitor = {
  slug: string;
  name: string;
  title: string;
  description: string;
  what: string;
  price: string;
  bestAt: string;
  rows: [string, string, string][]; // [topic, them, Budgeto]
  pick: { them: string; us: string };
};

export const COMPETITORS: Competitor[] = [
  {
    slug: "rocket-money",
    name: "Rocket Money",
    title: "Budgeto vs Rocket Money: find subscriptions without linking your bank",
    description: "An honest comparison: Rocket Money links your bank to track subscriptions and can cancel some for you. Budgeto reads a statement PDF, no bank login.",
    what: "A budgeting and subscription app that links your bank accounts (through a data aggregator) to list subscriptions, track spending and, on Premium, cancel some subscriptions or negotiate bills for you.",
    price: "Free version; Premium is \"choose your price\", roughly $6 to $12 a month on their site.",
    bestAt: "Ongoing tracking across linked accounts, bill negotiation and a concierge that cancels for you.",
    rows: [
      ["How it gets your data", "Bank login through a data aggregator", "The statement PDF you upload"],
      ["Bank password needed", "Yes, for the account link", "Never"],
      ["Time to first list", "After the accounts sync", "About 5 seconds"],
      ["Cancels for you", "Some, on Premium", "No: exact steps to do it yourself"],
      ["Bank fees flagged", "Spending view", "Hidden Fee Hunter with waive scripts"],
      ["Works with a photo of a paper statement", "No", "Yes"],
    ],
    pick: {
      them: "you want an always-on budget across linked accounts and someone to cancel or negotiate for you.",
      us: "you don't want to give any app your bank login, or you want the answer in seconds from the PDF you already have.",
    },
  },
  {
    slug: "ynab",
    name: "YNAB",
    title: "Budgeto vs YNAB: a quick leak check vs a full budgeting method",
    description: "An honest comparison: YNAB is a zero-based budgeting method. Budgeto is a 5-second scan of your statement PDF that finds forgotten subscriptions and fees.",
    what: "A zero-based budgeting app and method: you give every dollar a job, link accounts or enter transactions, and plan ahead month by month.",
    price: "$14.99 a month or $109 a year, with a 34-day free trial (their site).",
    bestAt: "Changing how you plan money, with a strong method, education and workshops.",
    rows: [
      ["What you get", "A budget you build and keep up", "A list of every recurring charge and fee"],
      ["Setup", "Accounts, categories, assigning dollars", "Drop one PDF"],
      ["Time to first insight", "Minutes to days", "About 5 seconds"],
      ["Bank login", "Optional, for syncing", "Never"],
      ["Finds forgotten subscriptions", "If you spot them while categorizing", "On the first screen"],
      ["Best used", "Every day", "Once a month, on a new statement"],
    ],
    pick: {
      them: "you want a full budgeting system and you're ready to use it every week.",
      us: "you want to know right now what's quietly billing you, without building a budget first. Many people use both.",
    },
  },
  {
    slug: "copilot",
    name: "Copilot Money",
    title: "Budgeto vs Copilot Money: no bank link, no setup",
    description: "An honest comparison: Copilot is a polished Apple-first budgeting app that links your accounts. Budgeto reads a statement PDF and lists your money leaks.",
    what: "A design-led budgeting and spending tracker for iPhone, iPad, Mac and the web. It links your accounts, categorizes transactions with AI and tracks investments.",
    price: "$13 a month or $95 a year after a free trial (their site).",
    bestAt: "A beautiful daily view of spending, budgets and investments on Apple devices.",
    rows: [
      ["How it gets your data", "Linked accounts", "The statement PDF you upload"],
      ["Devices", "Apple devices + web, no Android app", "Any phone or computer browser"],
      ["Bank login", "Yes, to link accounts", "Never"],
      ["Time to first insight", "After accounts sync and categories settle", "About 5 seconds"],
      ["Focus", "Budgets, categories, investments", "Forgotten subscriptions and hidden fees"],
      ["Trial", "Free trial", "Free to try, no card"],
    ],
    pick: {
      them: "you want a daily money dashboard on your Apple devices with linked accounts.",
      us: "you're on Android or any browser, don't want to link accounts, or just want your leaks found today.",
    },
  },
];

/** Common US subscriptions with their usual list price (editable on the page: always check your own). */
export const CALC_ITEMS: { name: string; price: number; group: string }[] = [
  { name: "Netflix", price: 17.99, group: "Streaming" },
  { name: "Hulu", price: 18.99, group: "Streaming" },
  { name: "Disney+", price: 15.99, group: "Streaming" },
  { name: "Max", price: 16.99, group: "Streaming" },
  { name: "Peacock", price: 10.99, group: "Streaming" },
  { name: "Paramount+", price: 7.99, group: "Streaming" },
  { name: "YouTube Premium", price: 13.99, group: "Streaming" },
  { name: "Spotify", price: 11.99, group: "Music" },
  { name: "Apple Music", price: 10.99, group: "Music" },
  { name: "SiriusXM", price: 10.99, group: "Music" },
  { name: "Amazon Prime", price: 14.99, group: "Shopping" },
  { name: "Walmart+", price: 12.95, group: "Shopping" },
  { name: "iCloud+", price: 2.99, group: "Cloud & apps" },
  { name: "Google One", price: 1.99, group: "Cloud & apps" },
  { name: "Adobe Creative Cloud", price: 59.99, group: "Cloud & apps" },
  { name: "Microsoft 365", price: 9.99, group: "Cloud & apps" },
  { name: "ChatGPT Plus", price: 20.0, group: "Cloud & apps" },
  { name: "Gym membership", price: 29.99, group: "Health" },
  { name: "Meditation app", price: 12.99, group: "Health" },
  { name: "Meal kit", price: 60.0, group: "Food" },
  { name: "Food delivery pass", price: 9.99, group: "Food" },
  { name: "Xbox Game Pass", price: 19.99, group: "Gaming" },
  { name: "PlayStation Plus", price: 9.99, group: "Gaming" },
  { name: "Bank monthly fee", price: 12.0, group: "Fees" },
];
