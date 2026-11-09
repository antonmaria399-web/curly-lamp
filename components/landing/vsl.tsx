"use client";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, FileText, Pause, Play, RotateCcw, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, usd } from "@/lib/cn";
import { CountUp } from "@/components/ui/reveal";

/**
 * Motion-design VSL (no video file): 8 scenes, ~58 s, big captions, muted autoplay when in view, replay button.
 * Values shown are the bundled SAMPLE statement's real results (labelled as an example).
 * If public/vsl.mp4 exists, the page passes `video` and the recorded film replaces this.
 */
const SCENES = [
  { d: 6500, cap: "Payday hits. Two weeks later, it's gone." },
  { d: 7000, cap: "Your statement? Six pages of codes." },
  { d: 7500, cap: "Subscriptions hide in plain sight." },
  { d: 7000, cap: "So drop the PDF into Budgeto." },
  { d: 8000, cap: "AI reads every line in seconds." },
  { d: 8500, cap: "There it is: your leak report." },
  { d: 7500, cap: "Cancel what you don't use. Keep the money." },
  { d: 6000, cap: "Find your leaks. Tonight." },
];
const TOTAL = SCENES.reduce((a, s) => a + s.d, 0);

const LINES = [
  ["09/02", "NETFLIX.COM 866-579-7172 CA", "-15.49"],
  ["09/04", "KROGER #412 COLUMBUS OH", "-96.32"],
  ["09/05", "CRUNCH FITNESS MEMBERSHIP", "-29.99"],
  ["09/06", "HULU 877-8244858 CA", "-17.99"],
  ["09/07", "SHELL OIL 57444 COLUMBUS", "-32.20"],
  ["09/08", "ADOBE *CREATIVE CLD SAN JOSE", "-22.99"],
  ["09/10", "APPLE.COM/BILL 866-712-7753", "-9.99"],
  ["09/11", "SMARTSAFE SELF STORAGE 114", "-44.00"],
  ["09/12", "AUDIBLE ADBL.CO/PYMT NJ", "-14.95"],
  ["09/23", "NON-NETWORK ATM FEE", "-3.50"],
  ["09/30", "MONTHLY SERVICE FEE", "-12.00"],
];
const HIDDEN = new Set([0, 2, 3, 5, 6, 7, 8, 9, 10]);

const LEAKS = [
  ["Smartsafe Self Storage", 44],
  ["Gym membership", 29.99],
  ["Adobe", 22.99],
  ["Hulu", 17.99],
  ["Netflix", 15.49],
];

function Scene({ i }: { i: number }) {
  const reduce = useReducedMotion();
  const fade = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: reduce ? 0 : 0.5 } };
  switch (i) {
    case 0:
      return (
        <motion.div {...fade} className="flex flex-col items-center">
          <div className="label-mono text-white/50">[ Checking · balance ]</div>
          <div className="num mt-3 text-[56px] font-semibold tracking-tight sm:text-[88px]">
            <Drop from={2370.8} to={182.4} />
          </div>
          <div className="mt-2 flex gap-1.5">
            {Array.from({ length: 14 }).map((_, k) => (
              <motion.span key={k} className="h-8 w-2 rounded-full bg-loss/70" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2 + k * 0.25 }} style={{ originY: 1 }} />
            ))}
          </div>
        </motion.div>
      );
    case 1:
    case 2:
      return (
        <motion.div {...fade} className="w-full max-w-[520px] overflow-hidden rounded-xl bg-white p-4 text-left text-ink shadow-2xl">
          <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            <span>Date · Description</span>
            <span>Amount</span>
          </div>
          <motion.div animate={i === 1 && !reduce ? { y: [0, -60, 0] } : {}} transition={{ duration: 6.5, ease: "easeInOut" }}>
            {LINES.map(([d, desc, a], k) => (
              <div key={k} className={cn("num flex items-center gap-3 rounded px-1.5 py-1 text-[11px] transition-colors duration-500 sm:text-[12px]", i === 2 && HIDDEN.has(k) && "bg-lime/70")}>
                <span className="text-zinc-400">{d}</span>
                <span className="flex-1 truncate">{desc}</span>
                <span>{a}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      );
    case 3:
      return (
        <motion.div {...fade} className="relative flex h-[220px] w-full max-w-[420px] items-center justify-center rounded-[22px] border-2 border-dashed border-white/25 bg-white/[0.04]">
          <div className="text-center">
            <Upload className="mx-auto h-7 w-7 text-lime" />
            <div className="mt-2 font-semibold">Drop your statement PDF</div>
          </div>
          <motion.div
            className="absolute flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-ink shadow-xl"
            initial={{ x: 160, y: -140, rotate: 12, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 0.8, 0.24, 1] }}
          >
            <FileText className="h-4 w-4 text-loss" /> september-statement.pdf
          </motion.div>
        </motion.div>
      );
    case 4:
      return (
        <motion.div {...fade} className="w-full max-w-[420px] space-y-3 text-left">
          {["Reading your statement", "Finding transactions", "Spotting recurring charges", "Checking for hidden fees", "Adding up your leaks"].map((s, k) => (
            <motion.div key={s} className="flex items-center gap-3 text-[17px]" initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + k * 1.2 }}>
              <motion.span className="grid h-7 w-7 place-items-center rounded-full border border-white/20" initial={{ backgroundColor: "rgba(0,0,0,0)" }} animate={{ backgroundColor: "#C8FF3D", borderColor: "#C8FF3D" }} transition={{ delay: 0.9 + k * 1.2 }}>
                <Check className="h-4 w-4 text-ink" strokeWidth={3} />
              </motion.span>
              {s}
            </motion.div>
          ))}
        </motion.div>
      );
    case 5:
      return (
        <motion.div {...fade} className="w-full max-w-[460px] text-left">
          <div className="label-mono text-white/50">[ Leaking every month · example ]</div>
          <div className="num mt-2 text-[52px] font-semibold leading-none tracking-tight sm:text-[72px]">
            <CountUp value={211.86} format={(n) => usd(n)} />
            <span className="ml-2 text-lg text-white/50">/ mo</span>
          </div>
          <div className="mt-5 space-y-2">
            {LEAKS.map(([m, v], k) => (
              <motion.div key={m as string} className="flex items-baseline gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + k * 0.3 }}>
                <span className="h-2 w-2 rounded-full bg-lime" />
                <span className="text-[15px]">{m}</span>
                <span className="ledger-leader" />
                <span className="num text-loss">−{usd(v as number)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    case 6:
      return (
        <motion.div {...fade} className="text-center">
          <div className="label-mono text-white/50">[ Cancel 3 you forgot · example ]</div>
          <div className="num mt-3 text-[56px] font-semibold tracking-tight text-[#4ade80] sm:text-[88px]">
            +<CountUp value={1163.76} format={(n) => usd(n)} />
          </div>
          <div className="text-white/60">kept every year</div>
        </motion.div>
      );
    default:
      return (
        <motion.div {...fade} className="text-center">
          <div className="title-xl text-[44px] sm:text-[72px]">
            Find my leaks<span className="text-lime">.</span>
          </div>
          <div className="num mt-3 text-white/60">Free to try · No bank login · No card</div>
        </motion.div>
      );
  }
}

function Drop({ from, to }: { from: number; to: number }) {
  const [v, setV] = useState(from);
  useEffect(() => {
    const s = performance.now();
    let raf = 0;
    const f = () => {
      const t = Math.min(1, (performance.now() - s) / 4500);
      setV(from + (to - from) * (1 - Math.pow(1 - t, 2)));
      if (t < 1) raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [from, to]);
  return <span>{usd(v)}</span>;
}

export function VSL({ video }: { video?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.4 });
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (video || !inView || !playing || ended) return;
    let last = performance.now();
    let raf = 0;
    const f = (now: number) => {
      setT((x) => {
        const n = x + (now - last);
        if (n >= TOTAL) {
          setEnded(true);
          return TOTAL;
        }
        return n;
      });
      last = now;
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [inView, playing, ended, video]);

  if (video)
    return (
      <div className="overflow-hidden rounded-[24px] border border-white/10">
        <video src="/vsl.mp4" autoPlay muted playsInline loop controls className="aspect-video w-full" />
      </div>
    );

  let acc = 0;
  let idx = 0;
  for (let i = 0; i < SCENES.length; i++) {
    if (t < acc + SCENES[i].d) {
      idx = i;
      break;
    }
    acc += SCENES[i].d;
    idx = i;
  }
  const replay = () => {
    setT(0);
    setEnded(false);
    setPlaying(true);
  };

  return (
    <div ref={box} className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0c0b] text-white shadow-[0_40px_120px_-40px_rgba(200,255,61,.25)]">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex aspect-[4/5] flex-col sm:aspect-video">
        <div className="flex flex-1 items-center justify-center px-5 pt-8 sm:px-10">
          <AnimatePresence mode="wait">
            <Scene key={idx} i={idx} />
          </AnimatePresence>
        </div>
        <div className="px-5 pb-16 pt-4 text-center sm:px-10 sm:pb-20">
          <AnimatePresence mode="wait">
            <motion.p key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-[640px] text-[24px] font-semibold leading-tight tracking-[-0.03em] sm:text-[34px]">
              {SCENES[idx].cap}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-4 pb-4 sm:px-6">
          <button
            onClick={() => (ended ? replay() : setPlaying((p) => !p))}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20"
            aria-label={ended ? "Replay" : playing ? "Pause" : "Play"}
          >
            {ended ? <RotateCcw className="h-4 w-4" /> : playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <div className="flex flex-1 gap-1">
            {SCENES.map((s, i) => {
              const start = SCENES.slice(0, i).reduce((a, x) => a + x.d, 0);
              const p = Math.max(0, Math.min(1, (t - start) / s.d));
              return (
                <button key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15" onClick={() => (setT(start), setEnded(false))} aria-label={`Scene ${i + 1}`}>
                  <span className="block h-full bg-lime" style={{ width: `${p * 100}%` }} />
                </button>
              );
            })}
          </div>
          <span className="num shrink-0 text-xs text-white/50">
            {Math.floor(t / 1000)}s / {Math.round(TOTAL / 1000)}s
          </span>
        </div>
      </div>
    </div>
  );
}
