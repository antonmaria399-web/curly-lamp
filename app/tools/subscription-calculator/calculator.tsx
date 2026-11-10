"use client";
import { useMemo, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { CTA } from "@/components/landing/bits";
import { cn, usd } from "@/lib/cn";

type Item = { id: number; name: string; price: number; on: boolean; cadence: "monthly" | "yearly" };

/** Typical US list prices as starting points only: every price is editable. */
const START: Omit<Item, "id">[] = [
  { name: "Netflix", price: 17.99, on: true, cadence: "monthly" },
  { name: "Spotify", price: 11.99, on: true, cadence: "monthly" },
  { name: "Disney+", price: 15.99, on: false, cadence: "monthly" },
  { name: "Hulu", price: 18.99, on: false, cadence: "monthly" },
  { name: "Max", price: 16.99, on: false, cadence: "monthly" },
  { name: "Amazon Prime", price: 14.99, on: true, cadence: "monthly" },
  { name: "YouTube Premium", price: 13.99, on: false, cadence: "monthly" },
  { name: "iCloud+ storage", price: 2.99, on: true, cadence: "monthly" },
  { name: "Gym membership", price: 29.99, on: false, cadence: "monthly" },
  { name: "Adobe Creative Cloud", price: 59.99, on: false, cadence: "monthly" },
  { name: "Delivery membership", price: 9.99, on: false, cadence: "monthly" },
  { name: "Antivirus (yearly)", price: 89.99, on: false, cadence: "yearly" },
];

export function Calculator() {
  const [items, setItems] = useState<Item[]>(() => START.map((x, i) => ({ ...x, id: i })));
  const [name, setName] = useState("");
  const monthly = useMemo(() => items.filter((i) => i.on).reduce((s, i) => s + (i.cadence === "yearly" ? i.price / 12 : i.price), 0), [items]);
  const count = items.filter((i) => i.on).length;
  const set = (id: number, patch: Partial<Item>) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-start">
      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-3 sm:p-4">
        <ul className="divide-y divide-white/[0.06]">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 px-1 py-2.5">
              <button
                onClick={() => set(i.id, { on: !i.on })}
                aria-pressed={i.on}
                aria-label={`${i.on ? "Remove" : "Add"} ${i.name}`}
                className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border transition", i.on ? "border-lime bg-lime text-ink" : "border-white/25")}
              >
                {i.on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </button>
              <span className={cn("min-w-0 flex-1 truncate text-[15px]", !i.on && "text-white/50")}>{i.name}</span>
              <label className="num flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 px-2 text-[14px]">
                $
                <input
                  inputMode="decimal"
                  value={i.price}
                  onChange={(e) => {
                    const v = Number(e.target.value.replace(/[^\d.]/g, ""));
                    if (!Number.isNaN(v) && v < 10000) set(i.id, { price: v, on: true });
                  }}
                  className="h-9 w-16 bg-transparent text-right outline-none"
                  aria-label={`${i.name} price`}
                />
              </label>
              <span className="num w-8 text-xs text-white/40">{i.cadence === "yearly" ? "/yr" : "/mo"}</span>
              {i.id >= 100 && (
                <button aria-label={`Delete ${i.name}`} onClick={() => setItems((xs) => xs.filter((x) => x.id !== i.id))} className="text-white/40 hover:text-white">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
        <form
          className="mt-2 flex gap-2 px-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            setItems((xs) => [...xs, { id: 100 + xs.length, name: name.trim().slice(0, 40), price: 9.99, on: true, cadence: "monthly" }]);
            setName("");
          }}
        >
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add another one" className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 text-[15px] outline-none focus:border-lime/60" />
          <button className="inline-flex h-10 items-center gap-1 rounded-xl bg-white/10 px-3 text-sm font-medium hover:bg-white/15">
            <Plus className="h-4 w-4" /> Add
          </button>
        </form>
        <p className="mt-3 px-1 text-xs text-white/40">Starting prices are typical US list prices and change often. Edit them to match your statement.</p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 md:sticky md:top-24">
        <div className="label-mono text-white/50">[ You pay ]</div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="num text-[48px] font-semibold leading-none tracking-tight text-lime" aria-live="polite">{usd(monthly)}</span>
          <span className="text-white/50">/ month</span>
        </div>
        <div className="num mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-white/[0.05] p-3">
            <div className="text-white/50">A year</div>
            <div className="mt-0.5 text-lg font-semibold">{usd(monthly * 12, 0)}</div>
          </div>
          <div className="rounded-xl bg-white/[0.05] p-3">
            <div className="text-white/50">In 5 years</div>
            <div className="mt-0.5 text-lg font-semibold">{usd(monthly * 60, 0)}</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/60">
          That&apos;s {count} {count === 1 ? "subscription" : "subscriptions"} you remember. Most statements hide a few more: yearly renewals, app charges under “APPLE.COM/BILL”, bank fees.
        </p>
        <div className="mt-6">
          <CTA className="w-full" />
        </div>
        <p className="num mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-white/40">Free · No bank login · Your real statement</p>
      </div>
    </div>
  );
}
