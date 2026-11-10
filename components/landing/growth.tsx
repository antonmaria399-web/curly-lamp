"use client";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Check, Repeat, RotateCcw, Scissors } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, usd } from "@/lib/cn";
import { HowPhone } from "./bits";

/* ------------------------------------------------------------------ */
/* The leak playground: a hero visual the visitor can play with.       */
/* Example values only, labelled as such.                              */
/* ------------------------------------------------------------------ */

const LEAKS = [
  { m: "Hulu", a: 17.99, c: "monthly", why: "Not opened in 94 days" },
  { m: "SmartSafe Self Storage", a: 44, c: "monthly", why: "Same amount every month" },
  { m: "Adobe Creative Cloud", a: 22.99, c: "monthly", why: "Renews monthly" },
  { m: "Crunch Fitness", a: 29.99, c: "monthly", why: "Membership, every month" },
  { m: "Audible", a: 14.95, c: "monthly", why: "Credits piling up" },
  { m: "Monthly service fee", a: 12, c: "bank fee", why: "Waived with direct deposit" },
];

function Rolling({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = usd(value);
      prev.current = value;
      return;
    }
    const c = animate(prev.current, value, { duration: 0.6, ease: [0.22, 0.8, 0.24, 1], onUpdate: (v) => (el.textContent = usd(v)) });
    prev.current = value;
    return () => c.stop();
  }, [value, reduce]);
  return (
    <span ref={ref} className={className}>
      {usd(value)}
    </span>
  );
}

export function LeakPlayground() {
  const [cut, setCut] = useState<Set<number>>(new Set());
  const total = LEAKS.reduce((s, l) => s + l.a, 0);
  const saved = LEAKS.reduce((s, l, i) => s + (cut.has(i) ? l.a : 0), 0);
  const left = total - saved;
  const toggle = (i: number) =>
    setCut((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12">
      <div>
        <span className="label-mono text-white/50">[ Try it ]</span>
        <h2 className="title-xl mt-4 text-[38px] sm:text-[56px]">
          Tap a leak.
          <br />
          <span className="grad-text">Watch it stop.</span>
        </h2>
        <p className="mt-5 max-w-md text-[17px] text-white/60">
          This is what a leak report feels like. Tap what you&apos;d cancel: the leak meter drops and your savings stack up. Your real report works the same way.
        </p>
        <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="label-mono text-white/45">[ Still leaking ]</div>
            <div className="mt-2 flex items-end gap-1.5">
              <ArrowDownRight className="mb-1 h-5 w-5 text-[#FB7185]" strokeWidth={2.5} />
              <Rolling value={left} className="num text-[28px] font-semibold leading-none tracking-tight" />
            </div>
            <div className="num mt-1 text-xs text-white/45">/ month</div>
          </div>
          <div className="rounded-2xl border border-[#4ADE80]/25 bg-[#4ADE80]/[0.07] p-4">
            <div className="label-mono text-[#4ADE80]/80">[ Saved ]</div>
            <div className="mt-2 text-[28px] font-semibold leading-none tracking-tight text-[#4ADE80]">
              +<Rolling value={saved * 12} className="num" />
            </div>
            <div className="num mt-1 text-xs text-white/45">/ year</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-[radial-gradient(closest-side,rgba(200,255,61,.12),transparent)]" />
        <div className="relative rounded-[26px] border border-white/10 bg-[#0b0c0b] p-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)] sm:p-4">
          <div className="flex items-center justify-between px-2 pb-3 pt-1">
            <span className="text-sm font-semibold">Leak report</span>
            <span className="label-mono text-white/40">[ Example ]</span>
          </div>
          <ul className="space-y-2">
            {LEAKS.map((l, i) => {
              const on = cut.has(i);
              return (
                <motion.li key={l.m} layout transition={{ type: "spring", damping: 26, stiffness: 320 }}>
                  <button
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition active:scale-[0.985]",
                      on ? "border-[#4ADE80]/30 bg-[#4ADE80]/[0.06]" : "border-white/[0.08] bg-white/[0.03] hover:border-lime/40",
                    )}
                  >
                    <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full transition", on ? "bg-[#4ADE80] text-ink" : "bg-white/[0.06] text-white/60 group-hover:bg-lime group-hover:text-ink")}>
                      {on ? <Check className="h-4 w-4" strokeWidth={3} /> : <Scissors className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-[15px] font-medium", on && "text-white/50 line-through decoration-white/30")}>{l.m}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-white/45">
                        <Repeat className="h-3 w-3" /> {l.c} · {on ? "cancelled" : l.why}
                      </span>
                    </span>
                    <span className={cn("num shrink-0 text-[15px] font-semibold", on ? "text-[#4ADE80]" : "text-[#FB7185]")}>
                      {on ? "+" : "−"}
                      {usd(l.a)}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
          <div className="mt-3 flex items-center justify-between px-2 pb-1 text-xs text-white/40">
            <span>Tap to cancel · tap again to undo</span>
            {cut.size > 0 && (
              <button onClick={() => setCut(new Set())} className="inline-flex items-center gap-1 hover:text-white">
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The scroll story: a sticky phone whose screen changes as they scroll */
/* ------------------------------------------------------------------ */

const STEPS: { n: 1 | 2 | 3; t: string; d: string }[] = [
  { n: 1, t: "Upload", d: "Download last month's statement PDF from your bank's website or app. Drop it in, or snap a photo. No bank login, ever." },
  { n: 2, t: "Analyze", d: "The AI reads every line, groups charges by merchant and flags what repeats: subscriptions, memberships, and the fees your bank adds." },
  { n: 3, t: "Save", d: "Cancel what you don't use with the steps we give you. Every cancelled leak stacks up in your savings tracker." },
];

function StepText({ s, onActive }: { s: (typeof STEPS)[number]; onActive: (n: 1 | 2 | 3) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(s.n);
  }, [inView, onActive, s.n]);
  return (
    <div ref={ref} className="flex min-h-[70vh] flex-col justify-center">
      <div className="num text-sm text-lime">0{s.n}</div>
      <h3 className={cn("mt-2 text-[40px] font-semibold tracking-[-0.03em] transition-opacity duration-500", inView ? "opacity-100" : "opacity-30")}>{s.t}</h3>
      <p className={cn("mt-3 max-w-[400px] text-[18px] leading-relaxed text-white/60 transition-opacity duration-500", inView ? "opacity-100" : "opacity-30")}>{s.d}</p>
    </div>
  );
}

export function ScrollStory() {
  const [active, setActive] = useState<1 | 2 | 3>(1);
  return (
    <>
      {/* Phones: one phone per step, stacked. */}
      <div className="grid gap-14 md:hidden">
        {STEPS.map((s) => (
          <div key={s.n} className="text-center">
            <HowPhone step={s.n} />
            <div className="num mt-8 text-sm text-lime">0{s.n}</div>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">{s.t}</h3>
            <p className="mx-auto mt-2 max-w-[320px] text-white/60">{s.d}</p>
          </div>
        ))}
      </div>
      {/* Computers: a sticky phone whose screen follows the scroll. */}
      <div className="hidden grid-cols-2 gap-16 md:grid">
        <div>
          {STEPS.map((s) => (
            <StepText key={s.n} s={s} onActive={setActive} />
          ))}
        </div>
        <div className="relative">
          <div className="sticky top-[calc(50vh-280px)] flex h-[560px] items-center justify-center">
            <div className="relative">
              {STEPS.map((s) => (
                <motion.div
                  key={s.n}
                  className={cn(s.n === 1 ? "relative" : "absolute inset-0")}
                  initial={false}
                  animate={{ opacity: active === s.n ? 1 : 0, scale: active === s.n ? 1 : 0.97, y: active === s.n ? 0 : 10 }}
                  transition={{ duration: 0.45, ease: [0.22, 0.8, 0.24, 1] }}
                  aria-hidden={active !== s.n}
                >
                  <HowPhone step={s.n} />
                </motion.div>
              ))}
              <div className="absolute -right-8 top-1/2 flex -translate-y-1/2 flex-col gap-2">
                {STEPS.map((s) => (
                  <span key={s.n} className={cn("h-2 w-2 rounded-full transition", active === s.n ? "bg-lime" : "bg-white/20")} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

