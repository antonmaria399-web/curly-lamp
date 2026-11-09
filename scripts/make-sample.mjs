// Generates public/sample-statement.pdf: a clearly labeled EXAMPLE checking statement used by "Try a sample statement".
// Run: node scripts/make-sample.mjs
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFileSync } from "node:fs";

const rows = [];
function add(date, desc, amount) {
  rows.push({ date, desc, amount });
}
for (const m of ["08", "09"]) {
  add(`${m}/01`, "PAYROLL DIRECT DEP ACME LOGISTICS", 1185.40);
  add(`${m}/01`, "RENT PAYMENT OAKWOOD APARTMENTS", -1325.0);
  add(`${m}/02`, "NETFLIX.COM 866-579-7172 CA", -15.49);
  add(`${m}/03`, "SPOTIFY USA NEW YORK NY", -11.99);
  add(`${m}/04`, "KROGER #412 COLUMBUS OH", -86.42 - Number(m) * 1.1);
  add(`${m}/05`, "CRUNCH FITNESS MEMBERSHIP", -29.99);
  add(`${m}/06`, "HULU 877-8244858 CA", -17.99);
  add(`${m}/07`, "SHELL OIL 57444 COLUMBUS OH", -41.2 + Number(m));
  add(`${m}/08`, "ADOBE *CREATIVE CLD SAN JOSE CA", -22.99);
  add(`${m}/09`, "CHIPOTLE 2231 COLUMBUS OH", -13.85);
  add(`${m}/10`, "APPLE.COM/BILL 866-712-7753 CA", -9.99);
  add(`${m}/11`, "SMARTSAFE SELF STORAGE UNIT 114", -44.0);
  add(`${m}/12`, "AUDIBLE ADBL.CO/PYMT NJ", -14.95);
  add(`${m}/14`, "VERIZON WIRELESS PAYMENT", -72.0);
  add(`${m}/15`, "PAYROLL DIRECT DEP ACME LOGISTICS", 1185.40);
  add(`${m}/16`, "DOORDASH DASHPASS SAN FRANCISCO", -9.99);
  add(`${m}/17`, "TARGET 00012 COLUMBUS OH", -54.18 + Number(m) * 2);
  add(`${m}/18`, "SIRIUSXM RADIO 888-635-5144", -10.99);
  add(`${m}/19`, "STARBUCKS STORE 10233", -6.45);
  add(`${m}/20`, "PEACOCKTV SUBSCRIPTION NY", -7.99);
  add(`${m}/22`, "AEP OHIO ELECTRIC PAYMENT", -96.3 + Number(m) * 3);
  add(`${m}/23`, "NON-NETWORK ATM FEE", -3.5);
  add(`${m}/23`, "ATM WITHDRAWAL 1440 N HIGH ST", -60.0);
  add(`${m}/25`, "VENMO PAYMENT 1023849", -25.0);
  add(`${m}/27`, "UBER TRIP HELP.UBER.COM", -18.4);
  add(`${m}/28`, "AMAZON MKTPLACE PMTS AMZN.COM", -32.17 + Number(m));
  add(`${m}/30`, "MONTHLY SERVICE FEE", -12.0);
}

const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const ink = rgb(0.06, 0.07, 0.06);
const grey = rgb(0.45, 0.45, 0.48);

let page = pdf.addPage([612, 792]);
let y = 740;
function header() {
  page.drawText("Sample Community Bank", { x: 48, y: 740, size: 16, font: bold, color: ink });
  page.drawText("EXAMPLE STATEMENT — for trying Budgeto. Not a real account.", { x: 48, y: 722, size: 9, font, color: grey });
  page.drawText("Everyday Checking  ·  Account ending 4821", { x: 48, y: 704, size: 10, font, color: ink });
  page.drawText("Statement period: Aug 1, 2026 - Sep 30, 2026", { x: 48, y: 690, size: 10, font, color: ink });
  page.drawText("Date", { x: 48, y: 660, size: 9, font: bold, color: grey });
  page.drawText("Description", { x: 100, y: 660, size: 9, font: bold, color: grey });
  page.drawText("Amount", { x: 430, y: 660, size: 9, font: bold, color: grey });
  page.drawText("Balance", { x: 505, y: 660, size: 9, font: bold, color: grey });
  y = 640;
}
header();
let balance = 1802.34;
page.drawText(`Beginning balance`, { x: 100, y, size: 9, font, color: ink });
page.drawText(balance.toFixed(2), { x: 505, y, size: 9, font, color: ink });
y -= 16;
for (const r of rows) {
  if (y < 60) {
    page = pdf.addPage([612, 792]);
    header();
  }
  balance += r.amount;
  const amt = (r.amount < 0 ? "-" : "") + Math.abs(r.amount).toFixed(2);
  page.drawText(r.date + "/2026", { x: 48, y, size: 9, font, color: ink });
  page.drawText(r.desc, { x: 100, y, size: 9, font, color: ink });
  page.drawText(amt, { x: 430, y, size: 9, font, color: r.amount < 0 ? ink : rgb(0.08, 0.5, 0.25) });
  page.drawText(balance.toFixed(2), { x: 505, y, size: 9, font, color: grey });
  y -= 16;
}
y -= 8;
page.drawText(`Ending balance`, { x: 100, y, size: 9, font: bold, color: ink });
page.drawText(balance.toFixed(2), { x: 505, y, size: 9, font: bold, color: ink });

writeFileSync(new URL("../public/sample-statement.pdf", import.meta.url), await pdf.save());
console.log("rows", rows.length, "ending", balance.toFixed(2));
