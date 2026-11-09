export type Cadence = "weekly" | "monthly" | "quarterly" | "yearly";

export type Txn = {
  date: string; // YYYY-MM-DD when known
  description: string;
  merchant: string;
  amount: number; // negative = money out
  category: string;
};

export type Leak = {
  key: string; // normalized merchant key
  merchant: string;
  amount: number; // last charge, positive dollars
  cadence: Cadence;
  monthly: number; // monthly equivalent
  category: string;
  kind: "subscription" | "fee" | "recurring";
  reason: string;
  occurrences: number;
  last_date: string | null;
  cancel_hint: string;
};

export type ReportResult = {
  bank: string | null;
  period: string | null;
  currency: "USD";
  transactions_count: number;
  total_out: number;
  total_in: number;
  categories: { name: string; amount: number }[];
  leaks: Leak[]; // subscriptions + recurring, sorted by monthly desc
  fees: Leak[]; // bank fees
  monthly_leaks: number;
  yearly_leaks: number;
  engine: "gemini" | "rules";
};

/** What a locked (unpaid) viewer receives. Never contains the hidden numbers. */
export type LockedResult = {
  locked: true;
  bank: string | null;
  period: string | null;
  transactions_count: number;
  leaks_count: number;
  fees_count: number;
  first_leak: Leak | null;
  categories_count: number;
};

export type ReportRow = {
  id: string;
  file_name: string | null;
  created_at: string;
  shared?: boolean;
  result: ReportResult | LockedResult | null;
};
