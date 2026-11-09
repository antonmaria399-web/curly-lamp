"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LedgerRow } from "@/components/funnel/report";
import { cn, usd } from "@/lib/cn";
import type { Leak } from "@/lib/types";

type L = Leak & { report_id: string };

export function LeaksBoard({ leaks, actions: initial }: { leaks: L[]; actions: Record<string, "keep" | "cancelled"> }) {
  const [actions, setActions] = useState(initial);
  const [tab, setTab] = useState<"review" | "keep" | "cancelled">("review");
  const router = useRouter();
  const groups = {
    review: leaks.filter((l) => !actions[l.key]),
    keep: leaks.filter((l) => actions[l.key] === "keep"),
    cancelled: leaks.filter((l) => actions[l.key] === "cancelled"),
  };
  const saved = groups.cancelled.reduce((a, l) => a + l.monthly, 0);
  const act = async (leak: Leak, s: "keep" | "cancelled" | "clear") => {
    const prev = actions;
    const next = { ...actions };
    if (s === "clear") delete next[leak.key];
    else next[leak.key] = s;
    setActions(next);
    const r = await fetch("/api/leaks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ merchant_key: leak.key, merchant: leak.merchant, monthly: leak.monthly, status: s }) });
    if (!r.ok) setActions(prev);
    else router.refresh();
  };
  if (leaks.length === 0)
    return (
      <div className="rounded-[20px] border border-dashed border-line p-8 text-center">
        <p className="text-muted">No leaks yet. Scan a statement to find them.</p>
        <Link href="/upload" className="mt-4 inline-flex h-11 items-center rounded-full bg-lime px-5 text-sm font-semibold text-ink">Find my leaks</Link>
      </div>
    );
  const list = groups[tab];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex rounded-full bg-surface-2 p-1 text-[13px] font-medium" role="tablist">
          {(
            [
              ["review", "To review"],
              ["keep", "Keeping"],
              ["cancelled", "Cancelled"],
            ] as const
          ).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("rounded-full px-3 py-1.5 transition", tab === k ? "bg-surface text-fg shadow-sm" : "text-muted")}>
              {label} <span className="num opacity-60">{groups[k].length}</span>
            </button>
          ))}
        </div>
        {saved > 0 && <span className="num text-sm font-semibold text-gain">+{usd(saved)}/mo saved</span>}
      </div>
      {list.length === 0 ? (
        <p className="rounded-[20px] border border-line bg-surface p-6 text-sm text-muted">
          {tab === "review" ? "All reviewed. Nice." : tab === "keep" ? "Nothing marked as kept yet." : "Mark a leak “I cancelled it” to count it here."}
        </p>
      ) : (
        <ul className="space-y-2">
          {list.map((l, i) => (
            <LedgerRow key={l.key} leak={l} index={i} status={actions[l.key] ?? null} onAction={(s) => act(l, s)} />
          ))}
        </ul>
      )}
    </div>
  );
}
