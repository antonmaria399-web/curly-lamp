// Runs the REAL scan engine (PDF text parser + lib/engine.ts#analyze) on public/sample-statement.pdf
// and writes lib/seo/sample-report.json, used as the example on the SEO pages.
// Usage: npx tsx scripts/sample-report.mts   (re-run after changing the engine or the sample)
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getDocumentProxy } from "../node_modules/unpdf/dist/index.mjs";
import { analyze, parseStatementText } from "../lib/engine";

type Item = { str: string; transform: number[]; width: number };
const root = path.resolve(import.meta.dirname, "..");
const pdf = await getDocumentProxy(new Uint8Array(readFileSync(path.join(root, "public/sample-statement.pdf"))));
const lines: string[] = [];
for (let p = 1; p <= pdf.numPages; p++) {
  const c = await (await pdf.getPage(p)).getTextContent();
  const rows = new Map<number, Item[]>();
  for (const it of c.items as Item[]) {
    if (!it.str?.trim()) continue;
    const y = Math.round(it.transform[5] / 3) * 3;
    if (!rows.has(y)) rows.set(y, []);
    rows.get(y)!.push(it);
  }
  for (const y of [...rows.keys()].sort((a, b) => b - a))
    lines.push(rows.get(y)!.sort((a, b) => a.transform[4] - b.transform[4]).map((i) => i.str).join("  ").trim());
}
const { txns, bank, period } = parseStatementText(lines);
const result = analyze(txns, { bank, period, engine: "rules" });
// Raw statement lines for the leaks, so pages can show "what the bank wrote" next to "what Budgeto found".
const raw = txns.filter((t) => t.amount < 0).map((t) => ({ date: t.date, description: t.description, amount: t.amount }));
writeFileSync(path.join(root, "lib/seo/sample-report.json"), JSON.stringify({ result, raw }, null, 1) + "\n");
console.log(`${result.transactions_count} transactions · ${result.leaks.length} leaks · ${result.fees.length} fees · $${result.monthly_leaks}/mo`);
