"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const field = "mt-1.5 h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-[16px] text-white outline-none transition placeholder:text-white/30 focus:border-lime/70";

export function ApplyForm() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  if (done)
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-lime" />
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">Application sent.</h3>
        <p className="mt-2 text-white/60">We&apos;ll answer by email, usually within 2 days.</p>
      </div>
    );
  return (
    <form
      className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-6 sm:p-7"
      onSubmit={async (e) => {
        e.preventDefault();
        setErr(null);
        setBusy(true);
        const f = new FormData(e.currentTarget);
        const r = await fetch("/api/creators", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) }).catch(() => null);
        setBusy(false);
        if (r?.ok) return setDone(true);
        setErr((await r?.json().catch(() => null))?.error || "Check your connection and try again.");
      }}
    >
      <label className="block text-sm text-white/70">
        Your name
        <input name="name" required maxLength={80} autoComplete="name" className={field} />
      </label>
      <label className="block text-sm text-white/70">
        Email
        <input name="email" type="email" required maxLength={160} autoComplete="email" className={field} />
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <label className="block text-sm text-white/70">
          TikTok or Instagram handle
          <input name="handle" required maxLength={80} placeholder="@yourname" className={field} />
        </label>
        <label className="block text-sm text-white/70">
          Platform
          <select name="platform" defaultValue="tiktok" className={field + " pr-8"}>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="both">Both</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm text-white/70">
          Average views
          <input name="avg_views" required inputMode="numeric" pattern="[0-9]*" placeholder="500" className={field} />
        </label>
        <label className="block text-sm text-white/70">
          Country
          <input name="country" required maxLength={60} placeholder="United States" autoComplete="country-name" className={field} />
        </label>
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {err && <p className="text-sm text-[#FB7185]">{err}</p>}
      <Button type="submit" variant="lime" size="lg" loading={busy} className="w-full">
        Send my application
      </Button>
      <p className="text-center text-xs text-white/40">We only use this to answer you. No spam, ever.</p>
    </form>
  );
}
