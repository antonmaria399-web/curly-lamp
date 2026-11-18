"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { CALC_ITEMS } from "@/lib/pages-content";
import { cn, usd } from "@/lib/cn";
import { CountUp } from "@/components/ui/reveal";

/**
 * The leak simulator: tap what you pay for, watch the leak meter count. A real taste of the RESULT
 * without an account (list prices are editable: everyone's plan is a bit different).
 */
export function LeakCalculator({ dark, compact, initial = ["Netflix", "Spotify", "Amazon Prime", "Gym membership"] }: { dark?: boolean; compact?: boolean; initial?: string[] }) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState<string[]>(initial);
  const [prices, setPrices] = useState<Record<string, number>>(() => Object.fromEntries(CALC_ITEMS.map((i) => [i.name, i.price])));
  const items = compact ? CALC_ITEMS.slice(0, 14) : CALC_ITEMS;
  const monthly = useMemo(() => on.reduce((a, n) => a + (prices[n] || 0), 0), [on, prices]);
  const toggle = (n: string) => setOn((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));

  return (
    <div className={cn("grid gap-6 md:grid-cols-[1.25fr_1fr] md:items-start", dark && "dark text-white")}>
      <div>
        <div className="label-mono text-muted">[ Tap what you pay for ]</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((i) => {
            const active = on.includes(i.name);
            return (
              <motion.button
                key={i.name}
                type="button"
                onClick={() => toggle(i.name)}
                whileTap={reduce ? undefined : { scale: 0.94 }}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-10 items-center gap-1.5 rounded-full border px-3.5 text-[14px] font-medium transition",
                  active ? "border-lime bg-lime text-ink" : "border-line bg-surface text-fg hover:border-fg/30",
                )}
              >
                {active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Plus className="h-3.5 w-3.5 opacity-60" />}
                {i.name}
              </motion.button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted">Usual US list prices, before tax. Tap an amount on the right to match your own plan.</p>
      </div>

      <div className="rounded-[22px] border border-line bg-surface p-5 shadow-[0_30px_60px_-40px_rgba(0,0,0,.5)]">
        <div className="label-mono text-muted">[ You&apos;re paying ]</div>
        <div className="mt-2 flex items-end gap-2">
          <ArrowDownRight className="mb-1.5 h-7 w-7 shrink-0 text-loss" strokeWidth={2.5} />
          <span className="num text-[44px] font-semibold leading-none tracking-tight">
            <CountUp value={monthly} format={(n) => usd(n)} />
          </span>
          <span className="num mb-1 text-muted">/ mo</span>
        </div>
        <p className="num mt-1.5 text-sm text-muted">= {usd(monthly * 12)} a year</p>
        <ul className="mt-4 max-h-[236px] space-y-1 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {on.map((n) => (
              <motion.li
                key={n}
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 overflow-hidden py-1 text-[14px]"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                <span className="truncate">{n}</span>
                <span className="ledger-leader" />
                <label className="num flex items-center text-loss">
                  −$
                  <input
                    aria-label={`${n} price per month`}
                    inputMode="decimal"
                    value={prices[n]}
                    onChange={(e) => {
                      const v = Number(e.target.value.replace(/[^\d.]/g, ""));
                      setPrices((p) => ({ ...p, [n]: Number.isFinite(v) ? Math.min(v, 9999) : 0 }));
                    }}
                    className="w-[58px] rounded bg-transparent text-right font-semibold outline-none focus:bg-surface-2"
                  />
                </label>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {on.length === 0 && <p className="mt-4 text-sm text-muted">Tap a subscription to add it.</p>}
        <p className="mt-4 border-t border-line pt-3 text-[13px] text-muted">
          That&apos;s what you remember. Your statement knows the rest: renewals, trials, bank fees.
        </p>
      </div>
    </div>
  );
}
