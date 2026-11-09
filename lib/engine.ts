import type { Cadence, Leak, ReportResult, Txn } from "./types";

/** Known subscription merchants in the US (normalized keyword → display name + where to cancel). */
const SUBS: [RegExp, string, string][] = [
  [/NETFLIX/, "Netflix", "netflix.com → Account → Cancel membership"],
  [/SPOTIFY/, "Spotify", "spotify.com/account → Manage plan → Cancel"],
  [/HULU/, "Hulu", "hulu.com/account → Cancel"],
  [/DISNEY/, "Disney+", "disneyplus.com → Account → Subscription → Cancel"],
  [/PARAMOUNT/, "Paramount+", "paramountplus.com → Account → Cancel"],
  [/PEACOCK/, "Peacock", "peacocktv.com → Account → Plans → Cancel"],
  [/\bHBO\b|\bMAX\.COM|HBOMAX|\bMAX\b/, "Max", "max.com → Profile → Subscription → Cancel"],
  [/YOUTUBE|GOOGLE \*YOUTUBE/, "YouTube Premium", "youtube.com/paid_memberships → Deactivate"],
  [/APPLE\.COM\/BILL|APPLE\.COM BILL|ITUNES/, "Apple subscriptions", "iPhone Settings → your name → Subscriptions"],
  [/AMAZON PRIME|AMZN PRIME|PRIME VIDEO|PRIME MEMBERSHIP/, "Amazon Prime", "amazon.com → Account → Prime → End membership"],
  [/AUDIBLE/, "Audible", "audible.com → Account details → Cancel membership"],
  [/KINDLE UNLTD|KINDLE UNLIMITED/, "Kindle Unlimited", "amazon.com/kindle-dbs/ku → Cancel"],
  [/PLANET FITNESS|PLANET FIT/, "Planet Fitness", "Cancel in the app or at your home club"],
  [/LA FITNESS|ANYTIME FITNESS|EQUINOX|ORANGETHEORY|CRUNCH FITNESS|24 HOUR FITNESS/, "Gym membership", "Call or visit your club; ask for written confirmation"],
  [/PELOTON/, "Peloton", "onepeloton.com → Settings → Subscriptions"],
  [/ADOBE/, "Adobe", "account.adobe.com → Plans → Cancel (check early-cancel fee)"],
  [/MICROSOFT\s*365|MSFT \*|MICROSOFT\*/, "Microsoft 365", "account.microsoft.com/services → Cancel"],
  [/DROPBOX/, "Dropbox", "dropbox.com/account/plan → Cancel"],
  [/GOOGLE \*GOOGLE ONE|GOOGLE ONE|GOOGLE STORAGE/, "Google One", "one.google.com → Settings → Cancel membership"],
  [/ICLOUD/, "iCloud+", "iPhone Settings → your name → iCloud → Manage storage"],
  [/OPENAI|CHATGPT/, "ChatGPT Plus", "chatgpt.com → Settings → Subscription → Cancel"],
  [/NYTIMES|NEW YORK TIMES|NYT /, "New York Times", "nytimes.com/account → Cancel subscription"],
  [/WSJ|WALL STREET JOURNAL/, "Wall Street Journal", "customercenter.wsj.com → Cancel"],
  [/SIRIUS/, "SiriusXM", "Call 1-866-635-2349 or chat at siriusxm.com"],
  [/DOORDASH DASHPASS|DASHPASS/, "DashPass", "DoorDash app → Account → DashPass → End"],
  [/UBER ONE|UBER \*ONE/, "Uber One", "Uber app → Account → Uber One → Manage"],
  [/GRUBHUB\+|GRUBHUB PLUS/, "Grubhub+", "Grubhub app → Account → Grubhub+ → Cancel"],
  [/INSTACART\+|INSTACART PLUS/, "Instacart+", "instacart.com → Account → Instacart+ → End"],
  [/XBOX|MICROSOFT \*XBOX/, "Xbox Game Pass", "account.microsoft.com/services → Cancel"],
  [/PLAYSTATION|SONY INTERACTIVE/, "PlayStation Plus", "PlayStation → Settings → Subscriptions"],
  [/NINTENDO/, "Nintendo Switch Online", "accounts.nintendo.com → Shop menu → Turn off auto-renewal"],
  [/CRUNCHYROLL/, "Crunchyroll", "crunchyroll.com/acct/membership → Cancel"],
  [/DUOLINGO/, "Duolingo Super", "Duolingo app → Settings → Subscription"],
  [/CALM\.COM|\bCALM\b/, "Calm", "calm.com → Profile → Manage subscription"],
  [/HEADSPACE/, "Headspace", "headspace.com → Account → Subscription → Cancel"],
  [/NOOM/, "Noom", "Noom app → Settings → Account → Cancel"],
  [/HELLOFRESH|HELLO FRESH/, "HelloFresh", "hellofresh.com → Account → Plan settings → Cancel"],
  [/NORTON|MCAFEE|LIFELOCK/, "Antivirus / ID protection", "Sign in to the vendor account → Auto-renewal → Off"],
  [/CANVA/, "Canva Pro", "canva.com → Settings → Billing & plans → Cancel"],
  [/LINKEDIN/, "LinkedIn Premium", "linkedin.com/premium/manage → Cancel"],
  [/TINDER|BUMBLE|HINGE/, "Dating app", "Cancel in the App Store / Google Play subscriptions"],
  [/PATREON/, "Patreon", "patreon.com/settings/memberships → Edit → Cancel"],
  [/ONLYFANS/, "Creator subscription", "Turn off auto-renew in the account settings"],
  [/TWITCH/, "Twitch", "twitch.tv/subscriptions → Don't renew"],
  [/GOOGLE PLAY/, "Google Play subscriptions", "Play Store → Profile → Payments & subscriptions"],
  [/WALMART\+|WALMART PLUS/, "Walmart+", "walmart.com/plus/account → Cancel"],
  [/COSTCO MEMBERSHIP|SAMS CLUB MEMBERSHIP/, "Warehouse membership", "Visit the membership desk"],
];

const FEES: [RegExp, string][] = [
  [/OVERDRAFT|OD FEE|NSF|INSUFFICIENT FUNDS/, "Overdraft fee"],
  [/MONTHLY SERVICE|MAINTENANCE FEE|MONTHLY FEE|SERVICE CHARGE|ACCOUNT FEE/, "Monthly account fee"],
  [/ATM FEE|NON-.*ATM|ATM SURCHARGE|ATM WITHDRAWAL FEE/, "ATM fee"],
  [/FOREIGN TRANSACTION|INTL TRANSACTION|INTERNATIONAL TRANSACTION FEE/, "Foreign transaction fee"],
  [/LATE FEE|LATE PAYMENT/, "Late fee"],
  [/INTEREST CHARGE|FINANCE CHARGE/, "Interest charge"],
  [/WIRE FEE|WIRE TRANSFER FEE/, "Wire fee"],
  [/PAPER STATEMENT/, "Paper statement fee"],
  [/TRANSFER FEE|INSTANT TRANSFER FEE/, "Transfer fee"],
];

/** Recurring but not a leak: rent, utilities, groceries, transfers, cash. */
const ESSENTIAL = ["Housing", "Bills & utilities", "Groceries & shopping", "Transport", "Transfers", "Insurance", "Income", "Food & delivery"];
const NOT_A_LEAK = /PAYROLL|DIRECT DEP|WITHDRAWAL|TRANSFER|VENMO|ZELLE|CASH APP|ATM|RENT|MORTGAGE|LOAN|CREDIT CARD PAYMENT|AUTOPAY.*CARD|TAX/;

const CATS: [RegExp, string][] = [
  [/NETFLIX|SPOTIFY|HULU|DISNEY|PARAMOUNT|PEACOCK|HBO|\bMAX\b|YOUTUBE|CRUNCHYROLL|TWITCH|SIRIUS|AUDIBLE|KINDLE|XBOX|PLAYSTATION|NINTENDO/, "Streaming & entertainment"],
  [/APPLE\.COM|ICLOUD|GOOGLE ONE|DROPBOX|ADOBE|MICROSOFT|OPENAI|CHATGPT|CANVA|LINKEDIN|NORTON|MCAFEE/, "Apps & software"],
  [/FITNESS|GYM|PELOTON|EQUINOX|ORANGETHEORY|CALM|HEADSPACE|NOOM/, "Health & fitness"],
  [/DOORDASH|UBER EATS|GRUBHUB|INSTACART|POSTMATES|HELLOFRESH|STARBUCKS|MCDONALD|CHIPOTLE|RESTAURANT|CAFE|PIZZA|TACO|BURGER|DUNKIN|CHICK-FIL-A|SUBWAY|SWEETGREEN/, "Food & delivery"],
  [/WHOLE FOODS|TRADER JOE|KROGER|SAFEWAY|PUBLIX|ALDI|HEB\b|WEGMANS|GROCERY|MARKET|COSTCO|SAMS CLUB|TARGET|WALMART/, "Groceries & shopping"],
  [/AMAZON|AMZN|EBAY|ETSY|BEST BUY|HOME DEPOT|LOWES|IKEA|TJ MAXX|MARSHALLS|ZARA|NIKE|SHEIN|TEMU/, "Shopping"],
  [/SHELL|CHEVRON|EXXON|MOBIL|BP\b|SUNOCO|MARATHON|SPEEDWAY|WAWA|GAS|UBER|LYFT|PARKING|TOLL|METRO|TRANSIT|MTA/, "Transport"],
  [/RENT|MORTGAGE|APARTMENT|PROPERTY|HOA/, "Housing"],
  [/VERIZON|T-MOBILE|TMOBILE|AT&T|COMCAST|XFINITY|SPECTRUM|ELECTRIC|ENERGY|WATER|UTILIT|PG&E|CON ED|DUKE ENERGY/, "Bills & utilities"],
  [/INSURANCE|GEICO|PROGRESSIVE|STATE FARM|ALLSTATE|LEMONADE/, "Insurance"],
  [/FEE|OVERDRAFT|INTEREST CHARGE|FINANCE CHARGE/, "Bank fees"],
  [/VENMO|ZELLE|CASH APP|PAYPAL|TRANSFER/, "Transfers"],
];

export function categorize(desc: string): string {
  const d = desc.toUpperCase();
  for (const [re, name] of CATS) if (re.test(d)) return name;
  return "Other";
}

export function normalizeMerchant(desc: string): string {
  let d = desc.toUpperCase();
  d = d.replace(/\b(POS|DEBIT|CARD|PURCHASE|RECURRING|ACH|WEB|PMT|PAYMENT|AUTOPAY|CHECKCARD|VISA|MC|DDA|ONLINE|PREAUTHORIZED|PREAUTH|TST\*|SQ \*|SQ\*|PP\*|PAYPAL \*)\b/g, " ");
  d = d.replace(/X{2,}\d+|#\d+|\*\w{6,}|\b\d{3,}\b|\d{2}\/\d{2}(\/\d{2,4})?|REF\s*\S+|ID:\s*\S+/g, " ");
  d = d.replace(/\b(CA|NY|TX|FL|WA|IL|NJ|MA|GA|CO|OR|AZ|NV|PA|OH|MI|NC|VA)\b\s*$/g, " ");
  d = d.replace(/[^A-Z0-9&+.\/ ]/g, " ").replace(/\s+/g, " ").trim();
  return d.split(" ").slice(0, 3).join(" ");
}

function knownSub(desc: string) {
  const d = desc.toUpperCase();
  for (const [re, name, hint] of SUBS) if (re.test(d)) return { name, hint };
  return null;
}

function knownFee(desc: string) {
  const d = desc.toUpperCase();
  for (const [re, name] of FEES) if (re.test(d)) return name;
  return null;
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase()).replace(/\.Com\b/g, ".com");
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function cadenceFromGaps(dates: string[]): Cadence | null {
  const ts = dates.map((d) => Date.parse(d)).filter((n) => !Number.isNaN(n)).sort((a, b) => a - b);
  if (ts.length < 2) return null;
  const gaps = ts.slice(1).map((t, i) => (t - ts[i]) / 86400000);
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  if (avg >= 5 && avg <= 9) return "weekly";
  if (avg >= 25 && avg <= 35) return "monthly";
  if (avg >= 80 && avg <= 100) return "quarterly";
  if (avg >= 350 && avg <= 380) return "yearly";
  return null;
}

const toMonthly = (amount: number, c: Cadence) =>
  c === "weekly" ? amount * 4.33 : c === "quarterly" ? amount / 3 : c === "yearly" ? amount / 12 : amount;

/**
 * The detection core shared by both extractors (Gemini and the PDF text parser):
 * groups money-out transactions by merchant and flags subscriptions, recurring charges and bank fees.
 */
export function analyze(
  txns: Txn[],
  meta: { bank: string | null; period: string | null; engine: "gemini" | "rules"; hints?: Record<string, boolean> },
  rules: { kind: string; value: string }[] = [],
): ReportResult {
  const out = txns.filter((t) => t.amount < 0);
  const ins = txns.filter((t) => t.amount > 0);
  const ignore = rules.filter((r) => r.kind === "ignore_merchant").map((r) => r.value.toUpperCase());
  const flagOver = rules.find((r) => r.kind === "flag_over");
  const flagOverAmount = flagOver ? Number(flagOver.value) : null;
  const watchCats = rules.filter((r) => r.kind === "watch_category").map((r) => r.value);

  const times = txns.map((t) => Date.parse(t.date)).filter((n) => !Number.isNaN(n));
  const spanDays = times.length ? (Math.max(...times) - Math.min(...times)) / 86400000 : 0;
  const months = Math.max(1, Math.round(spanDays / 30.4));

  const groups = new Map<string, Txn[]>();
  for (const t of out) {
    const key = t.merchant ? normalizeMerchant(t.merchant) || normalizeMerchant(t.description) : normalizeMerchant(t.description);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  const leaks: Leak[] = [];
  const fees: Leak[] = [];
  for (const [key, list] of groups) {
    const desc = list[0].description + " " + (list[0].merchant || "");
    if (ignore.some((i) => key.includes(i) || desc.toUpperCase().includes(i))) continue;
    const amounts = list.map((t) => Math.abs(t.amount));
    const last = list.slice().sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    const lastAmount = Math.abs(last.amount);
    const fee = knownFee(desc);
    if (fee) {
      const total = amounts.reduce((a, b) => a + b, 0);
      fees.push({
        key,
        merchant: fee,
        amount: round2(lastAmount),
        cadence: "monthly",
        monthly: round2(total / months),
        category: "Bank fees",
        kind: "fee",
        reason: list.length > 1 ? `Charged ${list.length} times on this statement` : "Bank fee — most banks waive it if you ask",
        occurrences: list.length,
        last_date: last.date || null,
        cancel_hint: "Call your bank and ask them to refund it and waive it going forward",
      });
      continue;
    }
    const sub = knownSub(desc);
    const similar = amounts.every((a) => Math.abs(a - lastAmount) <= Math.max(1, lastAmount * 0.1));
    const exact = amounts.every((a) => Math.abs(a - lastAmount) <= Math.max(0.5, lastAmount * 0.02));
    const cat = list[0].category && list[0].category !== "Other" ? list[0].category : categorize(desc);
    const essential = ESSENTIAL.includes(cat) || NOT_A_LEAK.test(desc.toUpperCase());
    const cad = cadenceFromGaps(list.map((t) => t.date));
    const hinted = meta.hints?.[key] ?? false;
    if (essential && !sub && !hinted) continue;
    const isRecurring = (list.length >= 2 && exact && (cad !== null || list.length >= 3)) || (list.length >= 2 && similar && Boolean(sub || hinted));
    const watched = watchCats.includes(cat);
    if (!sub && !isRecurring && !hinted && !watched) continue;
    if (!sub && !isRecurring && !hinted && watched && list.length < 2) continue;
    const cadence: Cadence = cad ?? (sub && lastAmount > 60 && list.length === 1 ? "yearly" : "monthly");
    const monthly = round2(toMonthly(lastAmount, cadence));
    const tooSmall = monthly < 0.99;
    if (tooSmall) continue;
    const kind: Leak["kind"] = sub || hinted ? "subscription" : "recurring";
    let reason =
      kind === "subscription"
        ? list.length > 1
          ? `Subscription — charged ${list.length} times, ${cadence}`
          : `Subscription — renews ${cadence} until you cancel`
        : `Same amount charged ${list.length} times (${cadence})`;
    if (flagOverAmount !== null && monthly >= flagOverAmount) reason += ` · over your $${flagOverAmount} rule`;
    leaks.push({
      key,
      merchant: sub?.name ?? (meta.engine === "rules" ? titleCase(key) : list[0].merchant || titleCase(key)),
      amount: round2(lastAmount),
      cadence,
      monthly,
      category: cat,
      kind,
      reason,
      occurrences: list.length,
      last_date: last.date || null,
      cancel_hint: sub?.hint ?? "Find the charge in your email (search the merchant name) and cancel from the account page",
    });
  }

  leaks.sort((a, b) => b.monthly - a.monthly);
  fees.sort((a, b) => b.monthly - a.monthly);

  const catMap = new Map<string, number>();
  for (const t of out) {
    const c = t.category && t.category !== "Other" ? t.category : categorize(t.description);
    catMap.set(c, (catMap.get(c) ?? 0) + Math.abs(t.amount));
  }
  const categories = [...catMap.entries()]
    .map(([name, amount]) => ({ name, amount: round2(amount) }))
    .sort((a, b) => b.amount - a.amount);

  const monthly = round2(leaks.reduce((a, l) => a + l.monthly, 0) + fees.reduce((a, f) => a + f.monthly, 0));
  return {
    bank: meta.bank,
    period: meta.period,
    currency: "USD",
    transactions_count: txns.length,
    total_out: round2(out.reduce((a, t) => a + Math.abs(t.amount), 0)),
    total_in: round2(ins.reduce((a, t) => a + t.amount, 0)),
    categories,
    leaks,
    fees,
    monthly_leaks: monthly,
    yearly_leaks: round2(monthly * 12),
    engine: meta.engine,
  };
}

/* ------------------------- PDF text extractor (no AI) ------------------------- */

const MONTHS: Record<string, number> = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };

function parseDate(raw: string, year: number): string | null {
  let m = raw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (m) {
    let y = m[3] ? Number(m[3]) : year;
    if (y < 100) y += 2000;
    return `${y}-${String(m[1]).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
  }
  m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return raw;
  m = raw.toUpperCase().match(/^([A-Z]{3})[A-Z]*\.?\s+(\d{1,2})(?:,?\s+(\d{4}))?$/);
  if (m && MONTHS[m[1]]) {
    const y = m[3] ? Number(m[3]) : year;
    return `${y}-${String(MONTHS[m[1]]).padStart(2, "0")}-${String(m[2]).padStart(2, "0")}`;
  }
  return null;
}

const AMT = /(\(?-?\+?\$?\s?[\d,]+\.\d{2}\)?)(\s*(?:CR|DR))?/gi;

function parseAmount(s: string): number {
  const neg = s.includes("-") || s.includes("(") || /DR/i.test(s);
  const n = Number(s.replace(/[^\d.]/g, ""));
  return neg ? -n : n;
}

/** Turn the text lines of a US bank statement into transactions. Lines start with a date and end with an amount. */
export function parseStatementText(lines: string[]): { txns: Txn[]; bank: string | null; period: string | null } {
  const head = lines.slice(0, 25).join(" ");
  const yearMatch = head.match(/\b(20\d{2})\b/);
  const year = yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();
  const bankLine = lines.slice(0, 8).find((l) => /BANK|CREDIT UNION|FINANCIAL|CHASE|WELLS|CITI|CAPITAL ONE|AMERICAN EXPRESS|DISCOVER/i.test(l));
  const bank = bankLine ? bankLine.replace(/\s{2,}.*/, "").trim().slice(0, 60) : null;
  const periodMatch = head.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\s*(?:-|–|to|through)\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4})|(\d{1,2}\/\d{1,2}\/\d{2,4}\s*(?:-|–|to|through)\s*\d{1,2}\/\d{1,2}\/\d{2,4})/i);
  const period = periodMatch ? periodMatch[0].replace(/\s+/g, " ") : null;

  // Detect a "withdrawals" vs "deposits" section to set signs when amounts are unsigned.
  let section: "out" | "in" | null = null;
  const txns: Txn[] = [];
  for (const raw of lines) {
    const line = raw.replace(/\s+/g, " ").trim();
    if (/^(withdrawals|debits|purchases|checks paid|fees|other withdrawals|electronic withdrawals|card purchases)/i.test(line)) section = "out";
    if (/^(deposits|credits|deposits and additions|payments and credits)/i.test(line)) section = "in";
    const dm = line.match(/^((?:\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)|(?:\d{4}-\d{2}-\d{2})|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:,?\s+\d{4})?))\s+(.*)$/i);
    if (!dm) continue;
    const date = parseDate(dm[1], year);
    if (!date) continue;
    let rest = dm[2];
    // second date column (posting date)
    rest = rest.replace(/^(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\s+/, "");
    const amounts = [...rest.matchAll(AMT)].map((m) => m[0]);
    if (amounts.length === 0) continue;
    // If 2+ amounts, the last one is usually the running balance.
    const amtStr = amounts.length >= 2 ? amounts[amounts.length - 2] : amounts[0];
    const firstAmtIdx = rest.indexOf(amounts[0]);
    const description = rest.slice(0, firstAmtIdx).trim();
    if (!description || /^(beginning|ending|opening|closing) balance/i.test(description) || /balance forward/i.test(description)) continue;
    let amount = parseAmount(amtStr);
    const explicitSign = /[-(]|DR|CR/i.test(amtStr);
    if (!explicitSign) {
      if (section === "in") amount = Math.abs(amount);
      else if (section === "out") amount = -Math.abs(amount);
      else if (/DEPOSIT|PAYROLL|DIRECT DEP|REFUND|INTEREST PAID|TRANSFER FROM|ZELLE FROM|CREDIT/i.test(description)) amount = Math.abs(amount);
      else amount = -Math.abs(amount);
    }
    if (!Number.isFinite(amount) || amount === 0 || Math.abs(amount) > 1_000_000) continue;
    txns.push({ date, description, merchant: description, amount, category: categorize(description) });
  }
  return { txns, bank, period };
}
