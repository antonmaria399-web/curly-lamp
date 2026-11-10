"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check, ChevronDown, Download, FileText, Repeat, Scissors, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { MainButton } from "@/components/ui/button";
import { cn, usd } from "@/lib/cn";
import { Phone } from "./phone";

/** Every main button leads into the funnel: the hero's drop zone. */
export function scrollToScan() {
  const el = document.getElementById("scan");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.animate([{ boxShadow: "0 0 0 0 rgba(200,255,61,0)" }, { boxShadow: "0 0 0 8px rgba(200,255,61,.35)" }, { boxShadow: "0 0 0 0 rgba(200,255,61,0)" }], { duration: 1200, delay: 450 });
}

export function CTA({ compact, className }: { compact?: boolean; className?: string }) {
  return <MainButton label="Find my leaks" compact={compact} className={className} onClick={scrollToScan} />;
}

export function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const scan = document.getElementById("scan");
    if (!scan) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(scan);
    return () => io.disconnect();
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 md:hidden"
        >
          <MainButton label="Find my leaks" className="w-full shadow-2xl" onClick={scrollToScan} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- How it works: 3 animated phones ---------------- */

function useLoop(n: number, ms: number) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => clearInterval(t);
  }, [n, ms, reduce]);
  return i;
}

export function HowPhone({ step }: { step: 1 | 2 | 3 }) {
  const k = useLoop(2, 3200);
  return (
    <Phone className="w-[230px]">
      <div className="px-4 pt-6">
        {step === 1 && (
          <div>
            <div className="text-[15px] font-semibold">Upload</div>
            <div className="relative mt-4 flex h-[260px] items-center justify-center rounded-2xl border-2 border-dashed border-white/20">
              <div className="text-center text-[12px] text-white/60">
                <Upload className="mx-auto mb-2 h-5 w-5 text-lime" /> Drop your statement PDF
              </div>
              <AnimatePresence>
                {k === 1 && (
                  <motion.div
                    className="absolute flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[11px] font-medium text-ink shadow-xl"
                    initial={{ y: -150, x: 40, rotate: 10, opacity: 0 }}
                    animate={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 0.8, 0.24, 1] }}
                  >
                    <FileText className="h-3.5 w-3.5 text-loss" /> statement.pdf
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-[15px] font-semibold">Analyze</div>
            <div className="relative mt-4 h-[180px] overflow-hidden rounded-xl bg-white p-3">
              {Array.from({ length: 10 }).map((_, j) => (
                <div key={j} className="mb-2 flex gap-2">
                  <div className="h-1.5 w-5 rounded bg-zinc-300" />
                  <div className={cn("h-1.5 flex-1 rounded", [1, 3, 6, 8].includes(j) ? "bg-lime" : "bg-zinc-200")} />
                  <div className="h-1.5 w-6 rounded bg-zinc-300" />
                </div>
              ))}
              <div className="absolute inset-x-0 h-0" style={{ animation: "scanline 1.8s ease-in-out infinite" }}>
                <div className="h-[2px] bg-lime shadow-[0_0_14px_4px_rgba(200,255,61,.6)]" />
              </div>
            </div>
            <div className="mt-4 space-y-2 text-[12px]">
              {["Finding transactions", "Spotting recurring charges", "Checking for hidden fees"].map((s, j) => (
                <div key={s} className="flex items-center gap-2">
                  <span className={cn("grid h-4 w-4 place-items-center rounded-full", j <= k + 1 ? "bg-lime text-ink" : "border border-white/20")}>{j <= k + 1 && <Check className="h-2.5 w-2.5" strokeWidth={3} />}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-[15px] font-semibold">Save</div>
            <div className="mt-3 rounded-xl border border-[#4ade80]/30 bg-[#4ade80]/10 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#4ade80]">Saved</div>
              <div className="num text-xl font-semibold text-[#4ade80]">+{usd(k === 1 ? 96.98 : 52.99)}/mo</div>
            </div>
            <div className="mt-3 space-y-2">
              {[
                ["Self storage", 44, true],
                ["Gym", 29.99, k === 1],
                ["Adobe", 22.99, k === 1],
                ["Hulu", 17.99, false],
              ].map(([m, v, c]) => (
                <div key={m as string} className="flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-2 text-[12px]">
                  <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full", c ? "bg-[#4ade80] text-ink" : "bg-lime/80")}>{c ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}</span>
                  <span className={cn("truncate", c && "line-through opacity-60")}>{m as string}</span>
                  <span className="ledger-leader" />
                  <span className="num shrink-0 whitespace-nowrap text-[#fb7185]">−{usd(v as number)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Phone>
  );
}

/* ---------------- Feature loops ---------------- */

export function FeatureLoop({ kind }: { kind: "scan" | "fees" | "goal" | "export" }) {
  const k = useLoop(4, 1600);
  if (kind === "scan")
    return (
      <div className="relative h-full overflow-hidden rounded-xl bg-white p-4">
        {Array.from({ length: 9 }).map((_, j) => (
          <div key={j} className="mb-2.5 flex gap-2">
            <div className="h-2 w-6 rounded bg-zinc-300" />
            <div className={cn("h-2 flex-1 rounded transition-colors duration-500", j <= k * 2 + 1 && [0, 2, 5, 7].includes(j) ? "bg-lime" : "bg-zinc-200")} />
            <div className="h-2 w-8 rounded bg-zinc-300" />
          </div>
        ))}
        <div className="absolute inset-x-0 h-0" style={{ animation: "scanline 2.2s ease-in-out infinite" }}>
          <div className="h-[2px] bg-lime shadow-[0_0_16px_5px_rgba(200,255,61,.6)]" />
        </div>
      </div>
    );
  if (kind === "fees")
    return (
      <div className="space-y-2 p-1">
        {[
          ["Monthly service fee", "12.00"],
          ["Non-network ATM fee", "3.50"],
          ["Overdraft fee", "35.00"],
        ].map(([m, v], j) => (
          <div key={m} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm">
            <AlertTriangle className={cn("h-4 w-4 transition-colors", j <= k ? "text-loss" : "text-muted/40")} />
            <span>{m}</span>
            <span className="ledger-leader" />
            <span className={cn("num transition-colors", j <= k ? "text-loss" : "text-muted")}>−${v}</span>
          </div>
        ))}
        <div className={cn("rounded-xl bg-fg px-3 py-2 text-center text-[13px] font-medium text-bg transition-opacity", k >= 3 ? "opacity-100" : "opacity-0")}>Call script: “Can you waive these fees?”</div>
      </div>
    );
  if (kind === "goal") {
    const pct = [0.22, 0.48, 0.74, 1][k];
    const R = 46;
    const C = 2 * Math.PI * R;
    return (
      <div className="flex h-full items-center justify-center gap-5">
        <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="currentColor" strokeOpacity=".1" strokeWidth="10" />
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--gain)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 1s cubic-bezier(.22,.8,.24,1)" }} />
        </svg>
        <div>
          <div className="label-mono text-muted">[ Goal $150/mo ]</div>
          <div className="num mt-1 text-3xl font-semibold text-gain">{usd(150 * pct)}</div>
          <div className="text-xs text-muted">freed up this month</div>
        </div>
      </div>
    );
  }
  const screens = [
    ["I was leaking", "$211.86", "every month"],
    ["11 subscriptions", "I forgot", "about"],
    ["That's", "$2,542", "a year"],
    ["Found in", "5 sec", "with Budgeto"],
  ];
  return (
    <div className="flex h-full items-center justify-center gap-3">
      <div className="relative aspect-[9/16] h-[190px] overflow-hidden rounded-xl bg-[#0b0c0b] text-white shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div key={k} className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="text-[11px] text-white/60">{screens[k][0]}</div>
            <div className="num my-1 text-[24px] font-semibold text-lime">{screens[k][1]}</div>
            <div className="text-[11px] text-white/60">{screens[k][2]}</div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-2 text-center text-[8px] tracking-[0.2em] text-white/40">BUDGETO</div>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium">
        <Download className="h-3.5 w-3.5" /> PNG 1080×1920
      </span>
    </div>
  );
}

/* ---------------- FAQ ---------------- */

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => (
        <div key={f.q}>
          <button className="flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] font-medium" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            {f.q}
            <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", open === i && "rotate-180")} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="pb-5 pr-8 text-[15px] leading-relaxed text-muted">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Notification on the hero phone (example values) ---------------- */

export function HeroNotifications() {
  const NOTES = [
    ["Leak found", "Hulu · $17.99/mo — you said you'd cancel it"],
    ["Your leak report is ready", "11 recurring charges · tap to see the total"],
    ["Hidden fee", "Monthly service fee $12.00 — ask your bank to waive it"],
    ["Goal reached", "You freed up $150 this month"],
    ["New leak spotted", "Adobe Creative Cloud went up to $22.99"],
  ];
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) {
      setN(3);
      return;
    }
    const timers = [0, 900, 1800].map((t, i) => setTimeout(() => setN(i + 1), t));
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => setN((x) => x + 1), 2600);
    }, 1800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(start);
      if (iv) clearInterval(iv);
    };
  }, [reduce]);
  const visible = [n - 1, n - 2, n - 3].filter((x) => x >= 0);
  return (
    <div className="space-y-2 px-3 pt-6">
      <AnimatePresence initial={false}>
        {visible.map((id, idx) => (
          <motion.div
            key={id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: idx === 0 ? 1 : 0.7, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className={cn("rounded-2xl bg-white/15 p-3 backdrop-blur-xl", idx === 2 && "hidden sm:block")}
          >
            <div className="flex items-center gap-2 text-[11px] text-white/70">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-lime">
                <Repeat className="h-3 w-3 text-ink" />
              </span>
              BUDGETO <span className="ml-auto">{idx === 0 ? "now" : `${idx}m ago`}</span>
            </div>
            <div className="mt-1 text-[13px] font-semibold">{NOTES[id % NOTES.length][0]}</div>
            <div className="text-[12px] leading-snug text-white/80">{NOTES[id % NOTES.length][1]}</div>
          </motion.div>
        ))}
      </AnimatePresence>
      <p className="pt-2 text-center text-[10px] text-white/40">
        <Scissors className="mr-1 inline h-3 w-3" />
        Example notifications
      </p>
    </div>
  );
}
