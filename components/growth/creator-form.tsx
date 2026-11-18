"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { MainButton } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const field = "mt-1.5 h-12 w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 text-[16px] text-white outline-none transition placeholder:text-white/30 focus:border-lime";

/** Creator application: name, email, handle, average views, country. Saved for the owner only. */
export function CreatorForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<{ msg: string; field?: string } | null>(null);
  const [platform, setPlatform] = useState<"tiktok" | "instagram" | "both">("tiktok");

  if (done)
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[22px] border border-lime/30 bg-lime/[0.06] p-8 text-center">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 11 }} className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lime text-ink">
          <Check className="h-7 w-7" strokeWidth={3} />
        </motion.span>
        <p className="mt-4 text-xl font-semibold">Application sent.</p>
        <p className="mt-1.5 text-white/60">We read every one. If it&apos;s a fit, you get your scripts and your own link by email.</p>
      </motion.div>
    );

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setErr(null);
        setBusy(true);
        const f = new FormData(e.currentTarget);
        const body = Object.fromEntries(f.entries());
        const r = await fetch("/api/creators", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, platform }) }).catch(() => null);
        setBusy(false);
        if (r?.ok) return setDone(true);
        const j = await r?.json().catch(() => null);
        setErr({ msg: j?.error || "Couldn't send it. Check your connection and try again.", field: j?.field });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/70">
          Your name
          <input name="name" required maxLength={80} autoComplete="name" className={field} placeholder="Jordan" />
        </label>
        <label className="block text-sm text-white/70">
          Email
          <input name="email" type="email" required maxLength={120} autoComplete="email" className={field} placeholder="you@email.com" />
        </label>
      </div>
      <div>
        <span className="text-sm text-white/70">Where you post</span>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {(["tiktok", "instagram", "both"] as const).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setPlatform(p)}
              aria-pressed={platform === p}
              className={cn("h-12 rounded-xl border text-[15px] font-medium transition", platform === p ? "border-lime bg-lime text-ink" : "border-white/12 bg-white/[0.04] text-white/80 hover:border-white/30")}
            >
              {p === "tiktok" ? "TikTok" : p === "instagram" ? "Instagram" : "Both"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/70">
          Your handle
          <input name="handle" required maxLength={80} className={field} placeholder="@yourhandle" />
        </label>
        <label className="block text-sm text-white/70">
          Average views per video
          <input name="avg_views" required inputMode="numeric" pattern="[0-9]*" maxLength={9} className={field} placeholder="500" />
        </label>
      </div>
      <label className="block text-sm text-white/70">
        Country
        <input name="country" required maxLength={60} autoComplete="country-name" className={field} placeholder="United States" />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {err && <p className="text-sm text-[#fb7185]">{err.msg}</p>}
      <MainButton type="submit" label="Apply to post" loading={busy} className="w-full sm:w-auto" />
      <p className="text-xs text-white/40">A new account about money works. No big audience needed.</p>
    </form>
  );
}
