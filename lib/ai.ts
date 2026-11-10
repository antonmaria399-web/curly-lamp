import "server-only";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
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

const WANTED = process.env.GEMINI_MODEL || "gemini-flash-latest";

export class ScanError extends Error {
  constructor(public code: "unreadable" | "no_transactions" | "image_needs_ai" | "ai_failed", message: string) {
    super(message);
  }
}

let candidates: string[] | null = null;
const gone = new Set<string>(); // models that answered 404 (skip them for the life of this instance)

/** Stable Flash models this key can use, newest first (cached per instance). Model names change over time. */
async function flashModels(ai: GoogleGenAI): Promise<string[]> {
  if (candidates) return candidates;
  const names: string[] = [];
  try {
    const pager = await ai.models.list({ config: { pageSize: 200 } });
    for await (const m of pager) {
      const n = (m.name || "").replace(/^models\//, "");
      const actions = (m as { supportedActions?: string[] }).supportedActions;
      if (!/^gemini-[\d.]+-flash(-lite)?$/.test(n)) continue; // stable Flash / Flash-Lite only (no preview/tts/image)
      if (actions && !actions.includes("generateContent")) continue;
      names.push(n);
    }
  } catch (e) {
    console.error("[ai] list models failed", (e as Error).message);
  }
  const ver = (n: string) => parseFloat(n.match(/gemini-([\d.]+)/)?.[1] || "0");
  // Newest full Flash first, then older Flash, then Lite (busy spells rarely hit every model at once).
  const full = names.filter((n) => !n.endsWith("-lite")).sort((x, y) => ver(y) - ver(x));
  const lite = names.filter((n) => n.endsWith("-lite")).sort((x, y) => ver(y) - ver(x));
  candidates = [...full.slice(0, 3), ...lite.slice(0, 2)];
  return candidates;
}

/** Reading a statement needs little reasoning: keep "thinking" low so a scan stays in seconds. */
function thinking(model: string) {
  const v = parseFloat(model.match(/gemini-([\d.]+)/)?.[1] || "3");
  return v >= 3 ? { thinkingLevel: ThinkingLevel.LOW } : { thinkingBudget: 0 };
}

const retryable = (msg: string) => /NOT_FOUND|is not found|UNAVAILABLE|RESOURCE_EXHAUSTED|high demand|overloaded|DEADLINE|aborted|timed? ?out|\b(404|429|500|503|504)\b/i.test(msg);

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

async function withGemini(file: Uint8Array, mime: string, budgetMs = 48_000, maxRounds = 4): Promise<{ txns: Txn[]; bank: string | null; period: string | null; hints: Record<string, boolean> }> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const deadline = Date.now() + budgetMs; // the route has 60 s; keep room for the text-parser fallback
  const call = (model: string, ms: number) =>
    ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ inlineData: { mimeType: mime, data: Buffer.from(file).toString("base64") } }, { text: PROMPT }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: schema,
        temperature: 0,
        thinkingConfig: thinking(model),
        abortSignal: AbortSignal.timeout(ms),
      },
    });
  // Try each model once; on "busy" answers, go round again after a short pause until the time budget runs out.
  let res: Awaited<ReturnType<typeof call>> | null = null;
  let last: unknown = null;
  let pool = gone.has(WANTED) ? await flashModels(ai) : [WANTED];
  for (let round = 0; round < maxRounds && !res; round++) {
    if (round > 0) {
      pool = await flashModels(ai);
      if (round > 1) await new Promise((r) => setTimeout(r, 1500 * round));
    }
    for (const model of pool.filter((m) => !gone.has(m))) {
      const left = deadline - Date.now();
      if (left < Math.min(8_000, budgetMs / 2) || res) break;
      try {
        res = await call(model, left);
      } catch (e) {
        last = e;
        const msg = (e as Error).message || String(e);
        console.warn(`[ai] ${model} failed (round ${round}): ${msg.slice(0, 160)}`);
        if (/NOT_FOUND|is not found/.test(msg)) gone.add(model);
        if (!retryable(msg)) throw e;
      }
    }
  }
  if (!res) throw last ?? new Error("no Gemini model available");
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
  opts: { textOnly?: boolean } = {},
): Promise<ReportResult> {
  const isPdf = mime === "application/pdf";
  // A text PDF is read instantly by the built-in parser. Gemini reads it better (cleaner names), but when
  // Google is busy we don't make the visitor wait: one quick round, then the parser's result.
  let text: Awaited<ReturnType<typeof withText>> | null = null;
  if (isPdf) text = await withText(file).catch(() => null);
  const quick = Boolean(text && text.txns.length > 0);
  // textOnly (the bundled sample): the parser reads it perfectly, so no AI call at all.
  if (aiEnabled() && !(opts.textOnly && quick)) {
    try {
      const g = await withGemini(file, mime, quick ? 9_000 : 48_000, quick ? 2 : 4);
      if (g.txns.length > 0) return analyze(g.txns, { bank: g.bank, period: g.period, engine: "gemini", hints: g.hints }, rules);
      throw new ScanError("no_transactions", "We couldn't find transactions in this file.");
    } catch (e) {
      if (e instanceof ScanError && e.code === "no_transactions" && !isPdf) throw e;
      console.error("[ai] gemini failed, falling back to text parser", (e as Error).message);
      if (!isPdf) throw new ScanError("ai_failed", "Our AI is busy right now. Try again in a minute, or upload the PDF from your bank's website.");
    }
  } else if (!isPdf) {
    throw new ScanError("image_needs_ai", "Photo scans are almost ready. For now, upload the PDF from your bank's website.");
  }
  const t = text ?? (await withText(file));
  if (t.txns.length === 0) throw new ScanError("no_transactions", "We couldn't find transactions in this file.");
  return analyze(t.txns, { bank: t.bank, period: t.period, engine: "rules" }, rules);
}
