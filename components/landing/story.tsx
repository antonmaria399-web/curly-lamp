"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Download, FileText, Landmark, Repeat } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Phone } from "./phone";
import { HeroNotifications } from "./bits";
import { cn } from "@/lib/cn";

const STEPS = [
  { n: "01", t: "Grab last month's PDF", d: "Every bank app has a Statements page. One tap on Download. A photo of a paper statement works too." },
  { n: "02", t: "Drop it in Budgeto", d: "The AI reads every line, groups charges by merchant and spots what repeats. About 5 seconds." },
  { n: "03", t: "See every leak", d: "Each subscription and fee, monthly and yearly, with the steps to stop it. Tap “I cancelled it” and watch the savings add up." },
  { n: "04", t: "It keeps watching", d: "Next month, scan again: new subscriptions, price hikes and fees that came back stand out." },
];

function Screen({ i }: { i: number }) {
  const reduce = useReducedMotion();
  if (i === 0)
    return (
      <div className="px-4 pt-7 text-[12px]">
        <div className="flex items-center gap-2 font-semibold">
          <Landmark className="h-4 w-4" /> Your bank · Statements
        </div>
        <div className="mt-4 space-y-2">
          {["October 2026", "September 2026", "August 2026", "July 2026"].map((m, j) => (
            <div key={m} className={cn("flex items-center justify-between rounded-xl px-3 py-2.5", j === 0 ? "bg-white/15" : "bg-white/5")}>
              <span className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-white/60" /> {m}
              </span>
              {j === 0 ? (
                <motion.span
                  className="inline-flex items-center gap-1 rounded-full bg-lime px-2 py-1 text-[10px] font-semibold text-ink"
                  animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                >
                  <Download className="h-3 w-3" /> PDF
                </motion.span>
              ) : (
                <span className="text-[10px] text-white/40">PDF</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-[10px] text-white/40">Example bank screen</p>
      </div>
    );
  if (i === 1)
    return (
      <div className="px-4 pt-7">
        <div className="relative overflow-hidden rounded-xl bg-white p-3">
          {Array.from({ length: 12 }).map((_, j) => (
            <motion.div
              key={j}
              className="mb-1.5 flex gap-1.5"
              initial={{ opacity: 0.5 }}
              animate={reduce ? { opacity: 1 } : { opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.9, delay: j * 0.12 }}
            >
              <div className="h-1.5 w-4 rounded bg-zinc-300" />
              <div className={cn("h-1.5 flex-1 rounded", [2, 5, 8].includes(j) ? "bg-lime" : "bg-zinc-200")} />
              <div className="h-1.5 w-6 rounded bg-zinc-300" />
            </motion.div>
          ))}
          {!reduce && (
            <div className="absolute inset-x-0 h-0" style={{ animation: "scanline 1.9s cubic-bezier(.45,0,.55,1) infinite" }}>
              <div className="h-[2px] bg-lime shadow-[0_0_14px_5px_rgba(200,255,61,.55)]" />
            </div>
          )}
        </div>
        <div className="num mt-4 text-center text-[13px] text-white/80">Spotting recurring charges…</div>
      </div>
    );
  if (i === 2)
    return (
      <div className="px-4 pt-7">
        <div className="label-mono text-[9px] text-white/50">[ Leaking every month ]</div>
        <div className="mt-1 flex items-end gap-1">
          <ArrowDownRight className="mb-1 h-5 w-5 text-[#fb7185]" strokeWidth={2.5} />
          <span className="num text-[30px] font-semibold leading-none">$86.46</span>
          <span className="num mb-0.5 text-[11px] text-white/50">/ mo</span>
        </div>
        <ul className="mt-4 space-y-1.5 text-[12px]">
          {[
            ["Hulu", "17.99"],
            ["Crunch Fitness", "29.99"],
            ["Adobe", "22.99"],
            ["Service fee", "12.00"],
          ].map(([m, a]) => (
            <li key={m} className="flex items-center gap-1.5 rounded-lg bg-white/[0.07] px-2.5 py-2">
              <Repeat className="h-3 w-3 text-lime" />
              {m}
              <span className="ledger-leader" />
              <span className="num font-semibold text-[#fb7185]">−{a}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-center text-[10px] text-white/40">Example values</p>
      </div>
    );
  return <HeroNotifications />;
}

/** A story told by the scroll: a sticky phone whose screen changes as the visitor scrolls through 4 steps. */
export function ScrollStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
      <div>
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="flex min-h-0 flex-col justify-center py-8 md:min-h-[62vh] md:py-0"
          >
            <div className={cn("transition-opacity duration-500", active === i ? "md:opacity-100" : "md:opacity-30")}>
              <div className="num text-sm text-lime">{s.n}</div>
              <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] sm:text-[36px]">{s.t}</h3>
              <p className="mt-2 max-w-md text-[17px] text-white/60">{s.d}</p>
            </div>
            {/* phones: the screen sits under its step */}
            <div className="mt-8 md:hidden">
              <Phone className="w-[230px]">
                <Screen i={i} />
              </Phone>
            </div>
          </div>
        ))}
      </div>
      <div className="relative hidden md:block">
        <div className="sticky top-[calc(50vh-280px)]">
          <Phone className="w-[270px]">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: [0.22, 0.8, 0.24, 1] }}>
                <Screen i={active} />
              </motion.div>
            </AnimatePresence>
          </Phone>
          <div className="mt-6 flex justify-center gap-1.5">
            {STEPS.map((s, i) => (
              <span key={s.n} className={cn("h-1.5 rounded-full transition-all", active === i ? "w-6 bg-lime" : "w-1.5 bg-white/25")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
