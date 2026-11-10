"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, usd } from "@/lib/cn";

async function act(body: Record<string, unknown>) {
  const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return r.ok;
}

export function CopyButton({ text, label = "Copy", small }: { text: string; label?: string; small?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard?.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line font-medium transition hover:bg-surface-2 active:scale-95",
        small ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-sm",
      )}
      aria-label={label}
    >
      {done ? <Check className="h-3.5 w-3.5 text-gain" /> : <Copy className="h-3.5 w-3.5" />}
      {!small && (done ? "Copied" : label)}
    </button>
  );
}

type App = { id: string; name: string; email: string; handle: string; platform: string; avg_views: number; country: string; status: string; ref_code: string | null; created_at: string };
const STATUSES = ["new", "accepted", "active", "stopped"] as const;

export function CreatorRow({ app, welcome }: { app: App; welcome: string }) {
  const router = useRouter();
  const [ref, setRef] = useState(app.ref_code ?? "");
  const [saving, setSaving] = useState(false);
  return (
    <div className="rounded-[20px] border border-line bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold">
            {app.name} <span className="font-normal text-muted">{app.handle}</span>
          </div>
          <div className="num mt-0.5 text-xs text-muted">
            {app.platform} · {app.avg_views.toLocaleString("en-US")} avg views · {app.country} · {app.email}
          </div>
        </div>
        <div className="flex rounded-full bg-surface-2 p-1 text-xs font-medium">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={async () => {
                await act({ action: "status", id: app.id, status: s });
                router.refresh();
              }}
              className={cn("rounded-full px-2.5 py-1 capitalize transition", app.status === s ? "bg-fg text-bg" : "text-muted")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {app.status !== "new" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 text-xs text-muted">
            ?ref=
            <input
              value={ref}
              onChange={(e) => setRef(e.target.value.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 32))}
              placeholder="their Kwop link code"
              className="num h-9 min-w-0 flex-1 rounded-xl border border-line bg-surface px-2.5 text-sm text-fg outline-none focus:border-fg/40"
            />
          </label>
          <Button
            size="sm"
            variant="outline"
            loading={saving}
            disabled={ref === (app.ref_code ?? "")}
            onClick={async () => {
              setSaving(true);
              await act({ action: "ref", id: app.id, ref_code: ref });
              setSaving(false);
              router.refresh();
            }}
          >
            Save link
          </Button>
          <CopyButton text={welcome} label="Copy the welcome message" />
        </div>
      )}
    </div>
  );
}

export function PayoutForm({ week, creators, rate, cap }: { week: string; creators: { id: string; handle: string }[]; rate: number; cap: number }) {
  const router = useRouter();
  const [id, setId] = useState(creators[0]?.id ?? "");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const v = Number(views) || 0;
  return (
    <form
      className="mt-4 grid gap-2 rounded-[20px] border border-dashed border-line p-4 sm:grid-cols-[1fr_1fr_120px_auto]"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await act({ action: "payout_add", id, week, views: v, video_url: url || undefined });
        setBusy(false);
        setViews("");
        setUrl("");
        router.refresh();
      }}
    >
      <select value={id} onChange={(e) => setId(e.target.value)} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm" aria-label="Creator">
        {creators.map((c) => (
          <option key={c.id} value={c.id}>
            {c.handle}
          </option>
        ))}
      </select>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Video link (optional)" className="h-11 rounded-xl border border-line bg-surface px-3 text-sm outline-none" />
      <input value={views} onChange={(e) => setViews(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Views" className="num h-11 rounded-xl border border-line bg-surface px-3 text-sm outline-none" aria-label="Views" />
      <Button type="submit" loading={busy} disabled={!id || !views}>
        Add · {usd(Math.min(cap, (v * rate) / 1000))}
      </Button>
    </form>
  );
}

export function DeletePayout({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      aria-label="Delete"
      onClick={async () => {
        await act({ action: "payout_delete", payout_id: id });
        router.refresh();
      }}
      className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
