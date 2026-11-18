"use client";
import { useEffect, useState } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { cn, usd } from "@/lib/cn";
import { welcomeMessage } from "@/lib/growth-content";

export function CopyButton({ text, label = "Copy", small, className }: { text: string; label?: string; small?: boolean; className?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard?.writeText(text).catch(() => {});
        setOk(true);
        setTimeout(() => setOk(false), 1600);
      }}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line font-medium transition hover:bg-surface-2 active:scale-95",
        small ? "h-8 w-8 justify-center" : "h-9 px-3.5 text-[13px]",
        className,
      )}
      aria-label={small ? "Copy" : undefined}
    >
      {ok ? <Check className="h-3.5 w-3.5 text-gain" /> : <Copy className="h-3.5 w-3.5" />}
      {!small && (ok ? "Copied" : label)}
    </button>
  );
}

type App = { id: string; name: string; email: string; handle: string; platform: string; avg_views: number; country: string; status: string; code: string | null; created_at: string };

const STATUSES = ["new", "accepted", "active", "stopped"] as const;

export function CreatorRow({ app, stats, rate, cap, site }: { app: App; stats: { signups: number; payers: number } | null; rate: number; cap: number; site: string }) {
  const [status, setStatus] = useState(app.status);
  const [code, setCode] = useState(app.code ?? "");
  const [saved, setSaved] = useState(false);
  const save = async (patch: Record<string, string>) => {
    const r = await fetch("/api/admin/creators", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: app.id, ...patch }) });
    if (r.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1400);
    }
  };
  const link = code ? `${site}/?ref=${code}` : `${site}/?ref=<their code>`;
  const profile = app.handle.startsWith("http")
    ? app.handle
    : app.platform === "instagram"
      ? `https://www.instagram.com/${app.handle.replace(/^@/, "")}`
      : `https://www.tiktok.com/${app.handle.startsWith("@") ? app.handle : "@" + app.handle}`;
  return (
    <li className="rounded-[20px] border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold">{app.name}</div>
          <a href={profile} target="_blank" rel="noreferrer" className="text-sm text-muted underline-offset-4 hover:underline">
            {app.handle} · {app.platform}
          </a>
          <div className="num mt-0.5 text-xs text-muted">
            ~{app.avg_views.toLocaleString("en-US")} views · {app.country} · {app.email} · {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </div>
        <div className="flex gap-1 rounded-full bg-surface-2 p-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                save({ status: s });
              }}
              className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize transition", status === s ? "bg-fg text-bg" : "text-muted")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-muted">
          Code
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 24))}
            onBlur={() => code !== (app.code ?? "") && save({ code })}
            placeholder="from Kwop"
            className="num h-9 w-32 rounded-lg border border-line bg-bg px-2.5 text-fg outline-none focus:border-fg/40"
          />
        </label>
        {saved && <Check className="h-4 w-4 text-gain" />}
        {stats && (
          <span className="num text-sm text-muted">
            {stats.signups} sign-ups · {stats.payers} payers
          </span>
        )}
        <CopyButton className="ml-auto" label="Copy the welcome message" text={welcomeMessage({ name: app.name, link, rate, cap })} />
      </div>
    </li>
  );
}

type Row = { creator: string; video: string; views: string };

/** Monday payout: the views typed × rate ÷ 1,000, capped per video. Kept in this browser until cleared. */
export function PayoutTable({ rate, cap, creators }: { rate: number; cap: number; creators: string[] }) {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem("bdg_payout") || "null");
      setRows(Array.isArray(v) && v.length ? v : [{ creator: creators[0] ?? "", video: "", views: "" }]);
    } catch {
      setRows([{ creator: creators[0] ?? "", video: "", views: "" }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("bdg_payout", JSON.stringify(rows));
    } catch {}
  }, [rows]);
  const pay = (v: string) => Math.min(cap, ((Number(v) || 0) * rate) / 1000);
  const total = rows.reduce((a, r) => a + pay(r.views), 0);
  const byCreator = rows.reduce<Record<string, number>>((a, r) => ((a[r.creator || "—"] = (a[r.creator || "—"] ?? 0) + pay(r.views)), a), {});
  const set = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div className="mt-3 overflow-hidden rounded-[20px] border border-line bg-surface">
      <datalist id="creators">
        {creators.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <ul className="divide-y divide-line">
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[1fr_auto] gap-2 p-3 sm:grid-cols-[150px_1fr_110px_90px_auto] sm:items-center">
            <input list="creators" value={r.creator} onChange={(e) => set(i, "creator", e.target.value)} placeholder="Creator" className="h-10 rounded-lg border border-line bg-bg px-2.5 text-sm outline-none" />
            <input value={r.video} onChange={(e) => set(i, "video", e.target.value)} placeholder="Video link" className="col-span-2 h-10 rounded-lg border border-line bg-bg px-2.5 text-sm outline-none sm:col-span-1" />
            <input
              value={r.views}
              inputMode="numeric"
              onChange={(e) => set(i, "views", e.target.value.replace(/\D/g, ""))}
              placeholder="Views"
              className="num h-10 rounded-lg border border-line bg-bg px-2.5 text-sm outline-none"
            />
            <span className="num text-right text-sm font-semibold">{usd(pay(r.views))}</span>
            <button onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} aria-label="Remove row" className="grid h-9 w-9 place-items-center justify-self-end rounded-full text-muted hover:bg-surface-2">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-2 px-4 py-3">
        <button onClick={() => setRows((rs) => [...rs, { creator: "", video: "", views: "" }])} className="inline-flex items-center gap-1.5 text-sm font-medium">
          <Plus className="h-4 w-4" /> Add a video
        </button>
        <div className="text-right">
          <div className="num text-lg font-semibold">Total to pay: {usd(total)}</div>
          <div className="num text-xs text-muted">
            {Object.entries(byCreator)
              .filter(([, v]) => v > 0)
              .map(([k, v]) => `${k} ${usd(v)}`)
              .join(" · ") || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
