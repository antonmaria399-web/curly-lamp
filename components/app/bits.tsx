"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Trash2, FileText, Share2, Check, Target, Loader2 } from "lucide-react";
import { Scanner } from "@/components/funnel/scanner";
import { useUnlock } from "@/components/funnel/unlock";
import { FullReport } from "@/components/funnel/report";
import { Button } from "@/components/ui/button";
import { cn, usd } from "@/lib/cn";
import type { ViewReport } from "@/lib/data";
import type { Leak, ReportResult } from "@/lib/types";

/** Opens the paywall on arrival when asked (?unlock=1, after Google sign-in from the landing page). */
export function AutoUnlock() {
  const { openPaywall, paid } = useUnlock();
  useEffect(() => {
    const u = new URL(location.href);
    if (u.searchParams.get("unlock") === "1") {
      u.searchParams.delete("unlock");
      history.replaceState(null, "", u.pathname + u.search);
      if (!paid) setTimeout(openPaywall, 300);
    }
  }, [openPaywall, paid]);
  return null;
}

export function AppScanner({ initial, compact }: { initial?: ViewReport | null; compact?: boolean }) {
  const router = useRouter();
  return <Scanner initial={initial ?? null} compact={compact} onScanned={() => router.refresh()} />;
}

export function UnlockButton({ label = "See my full leak report", className }: { label?: string; className?: string }) {
  const { unlock } = useUnlock();
  return (
    <Button variant="lime" size="lg" onClick={unlock} className={className}>
      <Lock className="h-4 w-4" /> {label}
    </Button>
  );
}

export function UpgradeLink({ children, tier, className }: { children: React.ReactNode; tier?: 2 | 3; className?: string }) {
  const { openUpgrade } = useUnlock();
  return (
    <button onClick={() => openUpgrade(tier)} className={className}>
      {children}
    </button>
  );
}

export function ReportList({ reports }: { reports: { id: string; file_name: string; created_at: string; monthly: number | null; leaks: number }[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  if (reports.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-line p-8 text-center">
        <FileText className="mx-auto h-6 w-6 text-muted" />
        <p className="mt-3 text-sm text-muted">No reports yet. Your first scan shows up here.</p>
      </div>
    );
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {reports.map((r) => (
        <li key={r.id} className="flex items-center gap-3 px-4 py-3.5">
          <Link href={`/reports/${r.id}`} className="flex min-w-0 flex-1 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{r.file_name}</span>
              <span className="num block text-xs text-muted">
                {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {r.leaks} leaks
              </span>
            </span>
          </Link>
          <span className="num text-sm font-semibold text-loss">{r.monthly === null ? <Lock className="h-4 w-4 text-muted" /> : `−${usd(r.monthly)}/mo`}</span>
          {confirm === r.id ? (
            <span className="flex gap-1">
              <button
                className="rounded-full bg-loss px-3 py-1.5 text-xs font-semibold text-white"
                onClick={async () => {
                  setBusy(r.id);
                  await fetch(`/api/reports/${r.id}`, { method: "DELETE" });
                  try {
                    const last = JSON.parse(localStorage.getItem("bdg_last") || "null");
                    if (last?.id === r.id) localStorage.removeItem("bdg_last");
                  } catch {}
                  setBusy(null);
                  setConfirm(null);
                  router.refresh();
                }}
              >
                {busy === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete"}
              </button>
              <button className="rounded-full border border-line px-3 py-1.5 text-xs" onClick={() => setConfirm(null)}>
                Keep
              </button>
            </span>
          ) : (
            <button onClick={() => setConfirm(r.id)} className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg" aria-label={`Delete ${r.file_name}`}>
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Full report with leak actions (cancelled / still use it) and the savings tracker. */
export function InteractiveReport({ report, actions: initial }: { report: ViewReport; actions: Record<string, "keep" | "cancelled"> }) {
  const [actions, setActions] = useState(initial);
  const { openUpgrade } = useUnlock();
  const router = useRouter();
  const act = async (leak: Leak, s: "keep" | "cancelled" | "clear") => {
    const prev = actions;
    const next = { ...actions };
    if (s === "clear") delete next[leak.key];
    else next[leak.key] = s;
    setActions(next);
    const r = await fetch("/api/leaks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchant_key: leak.key, merchant: leak.merchant, monthly: leak.monthly, status: s }),
    });
    if (!r.ok) setActions(prev);
    else router.refresh();
  };
  return <FullReport result={report.result as ReportResult} actions={actions} onAction={act} onLockedFees={() => openUpgrade(2)} />;
}

export function ShareButton({ id, shared: initial }: { id: string; shared: boolean }) {
  const [shared, setShared] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const share = async () => {
    setBusy(true);
    if (!shared) {
      const r = await fetch(`/api/reports/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shared: true }) });
      if (!r.ok) return setBusy(false);
      setShared(true);
    }
    const url = `${location.origin}/s/${id}`;
    setBusy(false);
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Budgeto leak report", text: "I found the subscriptions I forgot I was paying for with Budgeto.", url });
        return;
      }
    } catch {
      return;
    }
    await navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="outline" onClick={share} loading={busy}>
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} {copied ? "Link copied" : "Share"}
    </Button>
  );
}

export function GoalCard({ goal, saved, enabled }: { goal: number | null; saved: number; enabled: boolean }) {
  const router = useRouter();
  const { unlock } = useUnlock();
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(goal ? String(goal) : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const pct = goal ? Math.min(1, saved / goal) : 0;
  const R = 34;
  const C = 2 * Math.PI * R;
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="label-mono text-muted">[ Savings goal ]</div>
        {enabled && goal !== null && !edit && (
          <button className="text-xs font-medium text-muted underline-offset-4 hover:underline" onClick={() => setEdit(true)}>
            Change
          </button>
        )}
      </div>
      {!enabled ? (
        <div className="mt-3">
          <p className="text-sm text-muted">Set a monthly target and watch the money you free up stack toward it.</p>
          <button onClick={unlock} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
            <Lock className="h-3.5 w-3.5" /> Unlock to set a goal
          </button>
        </div>
      ) : goal === null || edit ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const n = Number(val.replace(/[$,]/g, ""));
            if (!(n > 0 && n < 100000)) return setErr("Enter an amount, like 150.");
            setBusy(true);
            const r = await fetch("/api/goal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ goal: n }) });
            setBusy(false);
            if (!r.ok) return setErr("Couldn't save. Try again.");
            setEdit(false);
            setErr(null);
            router.refresh();
          }}
        >
          <div className="relative flex-1">
            <span className="num absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">$</span>
            <input
              inputMode="decimal"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              placeholder="150"
              aria-label="Monthly savings goal in dollars"
              className="num h-11 w-full rounded-xl border border-line bg-bg pl-7 pr-12 outline-none focus:border-fg/40"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">/mo</span>
          </div>
          <Button type="submit" loading={busy}>
            <Target className="h-4 w-4" /> Set
          </Button>
          {err && <p className="sr-only" role="alert">{err}</p>}
        </form>
      ) : (
        <div className="mt-3 flex items-center gap-4">
          <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90 shrink-0">
            <circle cx="42" cy="42" r={R} fill="none" stroke="currentColor" strokeOpacity=".1" strokeWidth="8" />
            <circle cx="42" cy="42" r={R} fill="none" stroke="var(--gain)" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,.8,.24,1)" }} />
          </svg>
          <div>
            <div className="num text-2xl font-semibold text-gain">
              {usd(saved)} <span className="text-base font-normal text-muted">/ {usd(goal, 0)}</span>
            </div>
            <p className="text-sm text-muted">{pct >= 1 ? "Goal reached. Nice work." : `${usd(goal - saved)} to go each month`}</p>
          </div>
        </div>
      )}
      {err && <p className="mt-2 text-sm text-loss">{err}</p>}
      <div className={cn("hidden")} />
    </div>
  );
}
