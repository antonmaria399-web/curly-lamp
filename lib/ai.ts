import "server-only";
import { GoogleGenAI } from "@google/genai";
import { analyze, categorize, normalizeMerchant, parseStatementText } from "./engine";
import { pdfLines } from "./pdf";
import type { ReportResult, Txn } from "./types";

/**
 * The only AI entry point of Budgeto.
 * Reads a bank statement (PDF or photo) and returns the leak report.
 * - With GEMINI_API_KEY: Google Gemini (newest Flash model) reads the file and lists the transactions.
 * - Without it (or if Gemini fails on a text PDF): the PDF text parser does the same job for text PDFs.
 * The leak detection itself is the same deterministic code for both (lib/engine.ts).
 */

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

export class ScanError extends Error {
  constructor(public code: "unreadable" | "no_transactions" | "image_needs_ai" | "ai_failed", message: string) {
    super(message);
  }
}

const schema = {
  type: "object",
  properties: {
    is_statement: { type: "boolean", description: "true if this is a bank or credit card statement / transaction list" },
    bank: { type: ["string", "null"], description: "Bank or card issuer name as printed" },
    period: { type: ["string", "null"], description: "Statement period as printed, e.g. 'Sep 1, 2026 – Sep 30, 2026'" },
    transactions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string", description: "YYYY-MM-DD" },
          description: { type: "string", description: "The description as printed" },
          merchant: { type: "string", description: "Clean merchant name, e.g. 'Netflix', 'Planet Fitness', 'Chase overdraft fee'" },
          amount: { type: "number", description: "Negative for money out (purchases, fees, withdrawals), positive for money in" },
          category: {
            type: "string",
            enum: [
              "Streaming & entertainment",
              "Apps & software",
              "Health & fitness",
              "Food & delivery",
              "Groceries & shopping",
              "Shopping",
              "Transport",
              "Housing",
              "Bills & utilities",
              "Insurance",
              "Bank fees",
              "Transfers",
              "Income",
              "Other",
            ],
          },
          is_subscription: { type: "boolean", description: "true if this charge is a subscription or membership that renews automatically" },
        },
        required: ["date", "description", "merchant", "amount", "category", "is_subscription"],
      },
    },
  },
  required: ["is_statement", "bank", "period", "transactions"],
};

const PROMPT = `You read US bank and credit card statements for Budgeto, an app that finds forgotten subscriptions and hidden fees.
List EVERY transaction in the document exactly as printed (do not skip any, do not invent any). Ignore running balances, totals and summary lines.
Amounts: negative for money leaving the account (purchases, subscriptions, fees, withdrawals, payments made), positive for money coming in (deposits, payroll, refunds).
Merchant: a short clean name a person recognizes. Mark is_subscription true for memberships and subscriptions that renew by themselves (streaming, apps, gyms, software, cloud storage, news, delivery passes, insurance plans billed monthly).
If the document is not a statement or list of transactions, set is_statement false and return no transactions.`;

async function withGemini(file: Uint8Array, mime: string): Promise<{ txns: Txn[]; bank: string | null; period: string | null; hints: Record<string, boolean> }> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [{ inlineData: { mimeType: mime, data: Buffer.from(file).toString("base64") } }, { text: PROMPT }],
      },
    ],
    config: { responseMimeType: "application/json", responseJsonSchema: schema, temperature: 0 },
  });
  const text = res.text ?? "";
  const data = JSON.parse(text) as {
    is_statement: boolean;
    bank: string | null;
    period: string | null;
    transactions: (Txn & { is_subscription: boolean })[];
  };
  if (!data.is_statement) throw new ScanError("no_transactions", "This doesn't look like a bank statement.");
  const hints: Record<string, boolean> = {};
  const txns: Txn[] = (data.transactions || [])
    .filter((t) => typeof t.amount === "number" && Number.isFinite(t.amount) && t.amount !== 0)
    .slice(0, 2000)
    .map((t) => {
      const merchant = String(t.merchant || t.description || "").slice(0, 80);
      if (t.is_subscription) hints[normalizeMerchant(merchant)] = true;
      return {
        date: /^\d{4}-\d{2}-\d{2}$/.test(t.date) ? t.date : "",
        description: String(t.description || merchant).slice(0, 140),
        merchant,
        amount: Math.round(t.amount * 100) / 100,
        category: t.category === "Income" ? "Income" : t.category || categorize(String(t.description)),
      };
    });
  return { txns, bank: data.bank?.slice(0, 60) ?? null, period: data.period?.slice(0, 60) ?? null, hints };
}

async function withText(file: Uint8Array) {
  let lines: string[];
  try {
    lines = await pdfLines(file);
  } catch {
    throw new ScanError("unreadable", "We couldn't open this PDF.");
  }
  return parseStatementText(lines);
}

export function aiEnabled() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function scanStatement(
  file: Uint8Array,
  mime: string,
  rules: { kind: string; value: string }[] = [],
): Promise<ReportResult> {
  const isPdf = mime === "application/pdf";
  if (aiEnabled()) {
    try {
      const g = await withGemini(file, mime);
      if (g.txns.length > 0) return analyze(g.txns, { bank: g.bank, period: g.period, engine: "gemini", hints: g.hints }, rules);
      throw new ScanError("no_transactions", "We couldn't find transactions in this file.");
    } catch (e) {
      if (e instanceof ScanError && e.code === "no_transactions" && !isPdf) throw e;
      console.error("[ai] gemini failed, falling back to text parser", (e as Error).message);
      if (!isPdf) throw new ScanError("ai_failed", "Our AI is busy. Try again in a moment.");
    }
  } else if (!isPdf) {
    throw new ScanError("image_needs_ai", "Photo scans are almost ready. For now, upload the PDF from your bank's website.");
  }
  const t = await withText(file);
  if (t.txns.length === 0) throw new ScanError("no_transactions", "We couldn't find transactions in this file.");
  return analyze(t.txns, { bank: t.bank, period: t.period, engine: "rules" }, rules);
}
