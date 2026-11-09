"use client";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowDownRight, Check, Lock, RefreshCcw, Repeat, Scissors, Undo2 } from "lucide-react";
import { useState } from "react";
import { cn, usd } from "@/lib/cn";
import type { Leak, LockedResult, ReportResult } from "@/lib/types";
import { CountUp } from "@/components/ui/reveal";

const cadenceLabel = (c: Leak["cadence"]) => ({ weekly: "weekly", monthly: "monthly", quarterly: "every 3 mo", yearly: "yearly" })[c];

/** Ledger row: merchant · dotted leader · amount, with a recurring chip. */
export function LedgerRow({
  leak,
  status,
  onAction,
  compact,
  index = 0,
}: {
  leak: Leak;
  status?: "keep" | "cancelled" | null;
  onAction?: (s: "keep" | "cancelled" | "clear") => void;
  compact?: boolean;
  index?: number;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 10) * 0.04, duration: 0.35 }}
      className={cn("group rounded-2xl border border-line bg-surface px-4 py-3.5 transition", status === "cancelled" && "opacity-70")}
    >
      <button className="flex w-full items-baseline gap-2 text-left" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "mt-0.5 h-2 w-2 shrink-0 rounded-full",
              leak.kind === "fee" ? "bg-loss" : status === "cancelled" ? "bg-gain" : status === "keep" ? "bg-muted" : "bg-lime ring-2 ring-lime/30",
            )}
          />
          <span className={cn("truncate font-medium", status === "cancelled" && "line-through decoration-fg/30")}>{leak.merchant}</span>
        </span>
        <span className="ledger-leader" />
        <span className="num shrink-0 text-[15px] font-semibold text-loss">−{usd(leak.monthly)}</span>
        <span className="num shrink-0 text-xs text-muted">/mo</span>
      </button>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5">
          {leak.kind === "fee" ? <AlertTriangle className="h-3 w-3" /> : <Repeat className="h-3 w-3" />}
          {leak.kind === "fee" ? "bank fee" : cadenceLabel(leak.cadence)}
        </span>
        {leak.cadence !== "monthly" && leak.kind !== "fee" && <span className="num">{usd(leak.amount)} each</span>}
        <span className="truncate">{leak.reason}</span>
      </div>
      {open && !compact && (
        <div className="mt-3 space-y-3 border-t border-line pt-3 pl-4 text-sm">
          <p className="text-muted">
            <span className="font-medium text-fg">How to stop it: </span>
            {leak.cancel_hint}
          </p>
          <p className="num text-xs text-muted">
            {usd(leak.monthly * 12)} a year · last charged {leak.last_date ?? "on this statement"} · seen {leak.occurrences}×
          </p>
          {onAction && (
            <div className="flex flex-wrap gap-2">
              {status !== "cancelled" ? (
                <button onClick={() => onAction("cancelled")} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-lime px-4 text-[13px] font-semibold text-ink active:scale-95">
                  <Scissors className="h-3.5 w-3.5" /> I cancelled it
                </button>
              ) : (
                <button onClick={() => onAction("clear")} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-[13px] font-medium active:scale-95">
                  <Undo2 className="h-3.5 w-3.5" /> Undo
                </button>
              )}
              {status !== "keep" && status !== "cancelled" && (
                <button onClick={() => onAction("keep")} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-[13px] font-medium active:scale-95">
                  <Check className="h-3.5 w-3.5" /> I still use it
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </motion.li>
  );
}

/** The leak meter: a big tabular counter "$214.37 / mo" that counts up, with a red down-arrow. */
export function LeakMeter({ monthly, yearly, blurred, dark }: { monthly: number; yearly: number; blurred?: boolean; dark?: boolean }) {
  return (
    <div className={cn("relative", blurred && "select-none")} aria-label={blurred ? "Total hidden until you unlock" : undefined}>
      <div className="label-mono text-muted">[ Leaking every month ]</div>
      <div className={cn("mt-2 flex items-end gap-2", blurred && "locked-blur")}>
        <ArrowDownRight className="mb-2 h-8 w-8 shrink-0 text-loss" strokeWidth={2.5} />
        <span className={cn("num text-[44px] font-semibold leading-none tracking-tight sm:text-[56px]", dark ? "text-white" : "text-fg")}>
          {blurred ? "$000.00" : <CountUp value={monthly} format={(n) => usd(n)} />}
        </span>
        <span className="num mb-1.5 text-base text-muted">/ mo</span>
      </div>
      <div className={cn("num mt-2 text-sm text-muted", blurred && "locked-blur")}>
        = {blurred ? "$0,000.00" : usd(yearly)} a year you could keep
      </div>
    </div>
  );
}

function FakeRow({ w }: { w: number }) {
  return (
    <li className="rounded-2xl border border-line bg-surface px-4 py-3.5">
      <div className="flex items-baseline gap-2">
        <span className="h-2 w-2 rounded-full bg-lime" />
        <span className="h-3 rounded bg-fg/15" style={{ width: w }} />
        <span className="ledger-leader" />
        <span className="h-3 w-16 rounded bg-loss/30" />
      </div>
      <div className="mt-2 ml-4 h-2.5 w-40 rounded bg-fg/10" />
    </li>
  );
}

/** RESULT locked: leak #1 in clear (proof it's real), the total and every other leak blurred behind a lock. */
export function LockedReport({
  result,
  fileName,
  onUnlock,
  unlockLabel = "See my full leak report",
}: {
  result: LockedResult;
  fileName: string;
  onUnlock: () => void;
  unlockLabel?: string;
}) {
  const hidden = Math.max(0, result.leaks_count + result.fees_count - (result.first_leak ? 1 : 0));
  const widths = [132, 96, 150, 110, 88, 124];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        <span className="truncate font-medium text-fg">{fileName}</span>
        {result.bank && <span>· {result.bank}</span>}
        {result.period && <span className="num">· {result.period}</span>}
        <span className="num">· {result.transactions_count} transactions read</span>
      </div>

      <button onClick={onUnlock} className="relative block w-full text-left" aria-label={unlockLabel}>
        <LeakMeter monthly={0} yearly={0} blurred />
        <span className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded-full bg-fg px-3 py-1 text-xs font-medium text-bg">
          <Lock className="h-3 w-3" /> Locked
        </span>
      </button>

      {result.first_leak ? (
        <div>
          <div className="label-mono mb-2 text-muted">[ Leak #1 of {result.leaks_count + result.fees_count} ]</div>
          <ul>
            <LedgerRow leak={result.first_leak} compact />
          </ul>
        </div>
      ) : (
        <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
          Good news: we didn&apos;t spot a recurring charge on this statement. Your full report shows where the money went.
        </p>
      )}

      <div className="relative">
        <ul className="locked-blur space-y-2" aria-hidden>
          {Array.from({ length: Math.min(Math.max(hidden, 3), 6) }).map((_, i) => (
            <FakeRow key={i} w={widths[i % widths.length]} />
          ))}
        </ul>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/40 to-bg" />
        <button onClick={onUnlock} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-fg text-bg shadow-lg">
            <Lock className="h-5 w-5" />
          </span>
          <span className="max-w-[280px] text-sm font-medium">
            {hidden > 0 ? `${hidden} more ${hidden === 1 ? "leak" : "leaks"}, your monthly total and where the money went` : "Your monthly total and where the money went"}
          </span>
        </button>
      </div>
    </div>
  );
}

/** The full RESULT. */
export function FullReport({
  result,
  actions,
  onAction,
  onLockedFees,
}: {
  result: ReportResult & { fees_locked?: number };
  actions?: Record<string, "keep" | "cancelled">;
  onAction?: (leak: Leak, s: "keep" | "cancelled" | "clear") => void;
  onLockedFees?: () => void;
}) {
  const maxCat = result.categories[0]?.amount || 1;
  const saved = result.leaks.concat(result.fees).filter((l) => actions?.[l.key] === "cancelled").reduce((a, l) => a + l.monthly, 0);
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <LeakMeter monthly={result.monthly_leaks} yearly={result.yearly_leaks} />
        {saved > 0 && (
          <div className="rounded-2xl border border-gain/30 bg-gain/10 px-4 py-3">
            <div className="label-mono text-gain">[ Saved ]</div>
            <div className="num mt-1 text-2xl font-semibold text-gain">+{usd(saved)}/mo</div>
          </div>
        )}
      </div>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="label-mono text-muted">[ Subscriptions & repeat charges · {result.leaks.length} ]</h3>
          <span className="text-xs text-muted">Tap one for how to cancel</span>
        </div>
        {result.leaks.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">No subscriptions found on this statement. Nice.</p>
        ) : (
          <ul className="space-y-2">
            {result.leaks.map((l, i) => (
              <LedgerRow key={l.key} leak={l} index={i} status={actions?.[l.key] ?? null} onAction={onAction ? (s) => onAction(l, s) : undefined} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="label-mono mb-3 text-muted">[ Hidden Fee Hunter · bank fees ]</h3>
        {result.fees_locked ? (
          <button onClick={onLockedFees} className="relative block w-full overflow-hidden rounded-2xl border border-line bg-surface p-4 text-left">
            <ul className="locked-blur space-y-2" aria-hidden>
              {Array.from({ length: Math.min(result.fees_locked, 3) }).map((_, i) => (
                <FakeRow key={i} w={[120, 90, 140][i]} />
              ))}
            </ul>
            <span className="absolute inset-0 flex items-center justify-center gap-2 bg-bg/40 text-sm font-semibold">
              <Lock className="h-4 w-4" /> {result.fees_locked} bank {result.fees_locked === 1 ? "fee" : "fees"} found · Unlock with Pro
            </span>
          </button>
        ) : result.fees.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">No bank fees on this statement.</p>
        ) : (
          <ul className="space-y-2">
            {result.fees.map((l, i) => (
              <LedgerRow key={l.key} leak={l} index={i} status={actions?.[l.key] ?? null} onAction={onAction ? (s) => onAction(l, s) : undefined} />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="label-mono mb-3 text-muted">[ Where the money went ]</h3>
        <div className="space-y-2.5 rounded-2xl border border-line bg-surface p-4">
          {result.categories.slice(0, 8).map((c) => (
            <div key={c.name} className="text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span>{c.name}</span>
                <span className="num text-muted">{usd(c.amount, 0)}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full bg-fg/80"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(3, (c.amount / maxCat) * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 0.8, 0.24, 1] }}
                />
              </div>
            </div>
          ))}
          <p className="num pt-1 text-xs text-muted">
            {usd(result.total_out, 0)} out · {usd(result.total_in, 0)} in · {result.transactions_count} transactions
          </p>
        </div>
      </section>
    </div>
  );
}

export function ScanErrorBox({ message, onRetry, onSample }: { message: string; onRetry: () => void; onSample?: () => void }) {
  return (
    <div className="rounded-2xl border border-loss/25 bg-loss/5 p-5 text-center">
      <p className="font-medium">{message}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button onClick={onRetry} className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-5 text-sm font-semibold text-bg active:scale-95">
          <RefreshCcw className="h-4 w-4" /> Try again
        </button>
        {onSample && (
          <button onClick={onSample} className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm font-medium active:scale-95">
            Try the sample statement
          </button>
        )}
      </div>
    </div>
  );
}
