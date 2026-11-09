"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Monitor, Moon, Sun, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUnlock } from "@/components/funnel/unlock";
import { cn } from "@/lib/cn";

export function ThemePicker() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  useEffect(() => {
    try {
      setTheme((localStorage.getItem("budgeto-theme") as "light" | "dark") || "system");
    } catch {}
  }, []);
  const apply = (t: "system" | "light" | "dark") => {
    setTheme(t);
    try {
      if (t === "system") localStorage.removeItem("budgeto-theme");
      else localStorage.setItem("budgeto-theme", t);
    } catch {}
    const dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  };
  return (
    <div className="flex rounded-full bg-surface-2 p-1 text-sm font-medium">
      {(
        [
          ["system", Monitor, "Auto"],
          ["light", Sun, "Light"],
          ["dark", Moon, "Dark"],
        ] as const
      ).map(([k, I, l]) => (
        <button key={k} onClick={() => apply(k)} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 transition", theme === k ? "bg-surface text-fg shadow-sm" : "text-muted")} aria-pressed={theme === k}>
          <I className="h-3.5 w-3.5" /> {l}
        </button>
      ))}
    </div>
  );
}

type Rule = { id: string; kind: "flag_over" | "ignore_merchant" | "watch_category"; value: string };
const KIND_LABEL: Record<Rule["kind"], string> = {
  flag_over: "Flag anything over $",
  ignore_merchant: "Never flag",
  watch_category: "Always watch category",
};
const CATEGORIES = ["Food & delivery", "Shopping", "Streaming & entertainment", "Apps & software", "Health & fitness", "Transport"];

export function RulesEditor({ rules, enabled }: { rules: Rule[]; enabled: boolean }) {
  const router = useRouter();
  const { openUpgrade } = useUnlock();
  const [kind, setKind] = useState<Rule["kind"]>("flag_over");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  if (!enabled)
    return (
      <button onClick={() => openUpgrade(3)} className="relative block w-full overflow-hidden rounded-2xl border border-line bg-surface p-5 text-left">
        <div className="locked-blur space-y-2" aria-hidden>
          <div className="h-10 rounded-xl bg-surface-2" />
          <div className="h-10 rounded-xl bg-surface-2" />
        </div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold">
          <Lock className="h-4 w-4" /> Custom savings rules · Unlock with Power
        </span>
      </button>
    );
  return (
    <div className="space-y-3">
      {rules.length === 0 && <p className="text-sm text-muted">No rules yet. Rules apply to your next scans.</p>}
      <ul className="space-y-2">
        {rules.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm">
            <span>
              {KIND_LABEL[r.kind]}
              <b className="num">{r.value}</b>
            </span>
            <button
              aria-label="Delete rule"
              className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
              onClick={async () => {
                await fetch(`/api/rules?id=${r.id}`, { method: "DELETE" });
                router.refresh();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          setBusy(true);
          const r = await fetch("/api/rules", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, value }) });
          setBusy(false);
          if (!r.ok) return setErr((await r.json().catch(() => ({}))).error || "Couldn't save the rule.");
          setValue("");
          router.refresh();
        }}
      >
        <select value={kind} onChange={(e) => (setKind(e.target.value as Rule["kind"]), setValue(""))} className="h-11 rounded-xl border border-line bg-surface px-3 text-sm" aria-label="Rule type">
          <option value="flag_over">Flag anything over $…</option>
          <option value="ignore_merchant">Never flag a merchant</option>
          <option value="watch_category">Always watch a category</option>
        </select>
        {kind === "watch_category" ? (
          <select value={value} onChange={(e) => setValue(e.target.value)} className="h-11 flex-1 rounded-xl border border-line bg-surface px-3 text-sm" aria-label="Category">
            <option value="">Choose a category</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        ) : (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode={kind === "flag_over" ? "decimal" : "text"}
            placeholder={kind === "flag_over" ? "15" : "e.g. Spotify"}
            aria-label="Rule value"
            className="h-11 flex-1 rounded-xl border border-line bg-surface px-3 text-sm outline-none focus:border-fg/40"
          />
        )}
        <Button type="submit" loading={busy} disabled={!value}>
          <Plus className="h-4 w-4" /> Add rule
        </Button>
      </form>
      {err && <p className="text-sm text-loss">{err}</p>}
    </div>
  );
}

export function BillingCard({ planName, until, paid, status, tier }: { planName: string | null; until: string | null; paid: boolean; status: string | null; tier: number }) {
  const { openUpgrade, openPaywall } = useUnlock();
  const [step, setStep] = useState<0 | 1>(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ message: string; manage_url?: string } | null>(null);
  if (!paid)
    return (
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-muted">You&apos;re on the free try. Unlock to see full reports.</p>
        <Button variant="lime" className="mt-4" onClick={openPaywall}>
          See plans
        </Button>
      </div>
    );
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="label-mono text-muted">[ Current plan ]</div>
          <div className="mt-1 text-xl font-semibold">{planName}</div>
        </div>
        <div className="text-right text-sm text-muted">
          {until ? (
            <>
              {status === "canceled" || status === "cancelled" ? "Ends" : "Renews"} on{" "}
              <span className="num text-fg">{new Date(until).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </>
          ) : (
            status
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {tier < 3 && <Button onClick={() => openUpgrade()}>Change plan</Button>}
        {step === 0 ? (
          <Button variant="outline" onClick={() => setStep(1)}>
            Cancel my subscription
          </Button>
        ) : (
          <Button
            variant="danger"
            loading={busy}
            onClick={async () => {
              setBusy(true);
              const r = await fetch("/api/cancel", { method: "POST" });
              const j = await r.json().catch(() => ({ message: "Try again in a minute." }));
              setBusy(false);
              setMsg({ message: j.message || j.error, manage_url: j.manage_url });
              setStep(0);
            }}
          >
            Yes, cancel it
          </Button>
        )}
      </div>
      {step === 1 && <p className="mt-3 text-sm text-muted">You keep access until the end of the period you paid for.</p>}
      {msg && (
        <p className="mt-3 rounded-xl bg-surface-2 p-3 text-sm">
          {msg.message}{" "}
          {msg.manage_url && (
            <a href={msg.manage_url} target="_blank" rel="noreferrer" className="font-semibold underline">
              Manage billing
            </a>
          )}
        </p>
      )}
    </div>
  );
}

export function ProfileForm({ name: initial, email }: { name: string; email: string }) {
  const [name, setName] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await fetch("/api/account", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
        setBusy(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
    >
      <label className="block text-sm">
        <span className="text-muted">Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 outline-none focus:border-fg/40" />
      </label>
      <label className="block text-sm">
        <span className="text-muted">Email</span>
        <input value={email} disabled className="mt-1 h-11 w-full rounded-xl border border-line bg-surface-2 px-3 text-muted" />
      </label>
      <Button type="submit" variant="outline" loading={busy}>
        {saved ? "Saved" : "Save"}
      </Button>
    </form>
  );
}

export function DangerZone() {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={async () => {
            const { supabaseBrowser } = await import("@/lib/supabase/client");
            await supabaseBrowser().auth.signOut();
            try {
              localStorage.removeItem("bdg_last");
            } catch {}
            location.assign("/");
          }}
        >
          Log out
        </Button>
        {step === 0 ? (
          <Button variant="ghost" className="text-loss" onClick={() => setStep(1)}>
            <Trash2 className="h-4 w-4" /> Delete my account
          </Button>
        ) : (
          <Button
            variant="danger"
            loading={busy}
            onClick={async () => {
              setBusy(true);
              const r = await fetch("/api/account", { method: "DELETE" });
              if (r.ok) {
                try {
                  localStorage.removeItem("bdg_last");
                } catch {}
                location.assign("/?deleted=1");
              } else setBusy(false);
            }}
          >
            Yes, delete everything
          </Button>
        )}
      </div>
      {step === 1 && <p className="text-sm text-muted">This deletes your account, every report, your leaks and rules, and cancels your plan. It can&apos;t be undone.</p>}
    </div>
  );
}
