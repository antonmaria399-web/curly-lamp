"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, Check, FileText, Lock, Sparkles, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { LockedResult, ReportResult } from "@/lib/types";
import { FullReport, LockedReport, ScanErrorBox } from "./report";
import { useUnlock } from "./unlock";
import { MainButton } from "@/components/ui/button";

type Done = { id: string; file_name: string; result: LockedResult | (ReportResult & { fees_locked?: number }) };

const STEPS = ["Reading your statement", "Finding transactions", "Spotting recurring charges", "Checking for hidden fees", "Adding up your leaks"];
const MIN_MS = 5200;

const isLockedResult = (r: Done["result"]): r is LockedResult => "locked" in r && r.locked === true;

/** Render page 1 of a PDF in the browser for the scan frame (so the scan runs over THEIR statement). */
async function pdfThumb(data: ArrayBuffer): Promise<string | null> {
  try {
    const { getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(data));
    const page = await pdf.getPage(1);
    const vp = page.getViewport({ scale: 1.1 });
    const canvas = document.createElement("canvas");
    canvas.width = vp.width;
    canvas.height = vp.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport: vp, canvas } as never).promise;
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch {
    return null;
  }
}

/** The scan frame: their page with a lime line sweeping down, rows lighting up, and a progress ring. */
function ScanFrame({ thumb, progress, stepIdx, fileName, dark }: { thumb: string | null; progress: number; stepIdx: number; fileName: string; dark?: boolean }) {
  const reduce = useReducedMotion();
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-center">
      <div className={cn("relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl border shadow-2xl", dark ? "border-white/10 bg-white" : "border-line bg-white")}>
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-full w-full object-cover object-top opacity-90" />
        ) : (
          <div className="space-y-2.5 p-5">
            <div className="h-3 w-24 rounded bg-zinc-800/80" />
            <div className="h-2 w-32 rounded bg-zinc-300" />
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="flex gap-2">
                <div className="h-2 w-6 rounded bg-zinc-300" />
                <div className="h-2 flex-1 rounded bg-zinc-200" />
                <div className="h-2 w-8 rounded bg-zinc-300" />
              </div>
            ))}
          </div>
        )}
        {/* rows lighting up */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-3 right-3 h-[10px] rounded bg-lime/50 mix-blend-multiply"
              style={{ top: `${18 + i * 12.5}%` }}
              initial={{ opacity: 0, scaleX: 0.3 }}
              animate={progress > 12 + i * 13 ? { opacity: [0, 0.9, 0.45], scaleX: 1 } : {}}
              transition={{ duration: 0.6 }}
            />
          ))}
        </div>
        {!reduce && (
          <div className="absolute inset-x-0 h-0" style={{ animation: "scanline 1.9s cubic-bezier(.45,0,.55,1) infinite" }}>
            <div className="h-[2px] bg-lime shadow-[0_0_18px_6px_rgba(200,255,61,.55)]" />
            <div className="h-16 -translate-y-full bg-gradient-to-t from-lime/25 to-transparent" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 text-[11px] font-medium text-white">
          <FileText className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{fileName}</span>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-4">
          <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0 -rotate-90" aria-hidden>
            <circle cx="32" cy="32" r={R} fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="5" />
            <circle cx="32" cy="32" r={R} fill="none" stroke="#C8FF3D" strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress / 100)} style={{ transition: "stroke-dashoffset .25s linear" }} />
          </svg>
          <div>
            <div className="num text-[34px] font-semibold leading-none" aria-live="polite">
              {Math.floor(progress)}%
            </div>
            <div className="mt-1 text-sm text-muted">Scanning your statement…</div>
          </div>
        </div>
        <ul className="mt-6 space-y-3">
          {STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <li key={s} className={cn("flex items-center gap-3 text-[15px] transition-colors", done ? "" : active ? "" : "opacity-40")}>
                <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border transition", done ? "border-lime bg-lime text-ink" : "border-current/30")}>
                  {done ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </motion.span>
                  ) : active ? (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
                  ) : null}
                </span>
                {s}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function Scanner({
  dark,
  initial,
  onScanned,
  compact,
  sticky = true,
}: {
  dark?: boolean;
  initial?: Done | null;
  onScanned?: (d: Done) => void;
  compact?: boolean;
  sticky?: boolean;
}) {
  const { unlock, authed, paid, minPerDay, openUpgrade } = useUnlock();
  const [stage, setStage] = useState<"idle" | "scanning" | "ready" | "done" | "error">(initial ? "done" : "idle");
  const [done, setDone] = useState<Done | null>(initial ?? null);
  const [error, setError] = useState<{ msg: string; code?: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [thumb, setThumb] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [drag, setDrag] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const lastInput = useRef<{ file?: File; sample?: boolean } | null>(null);
  const reduce = useReducedMotion();

  // A returning visitor lands on their result (kept in this browser).
  useEffect(() => {
    if (initial) return;
    let last: { id: string } | null = null;
    try {
      last = JSON.parse(localStorage.getItem("bdg_last") || "null");
    } catch {}
    if (!last?.id) return;
    fetch(`/api/reports/${last.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.result) {
          setDone(j);
          setStage("done");
          setWelcome(true);
          onScanned?.(j);
        } else localStorage.removeItem("bdg_last");
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // When the account gets a plan (after the unlock film), reload the report in full.
  const refetch = useCallback(async (id: string) => {
    const j = await fetch(`/api/reports/${id}`).then((r) => (r.ok ? r.json() : null));
    if (j?.result) setDone(j);
  }, []);
  useEffect(() => {
    if (paid && done && isLockedResult(done.result)) refetch(done.id);
  }, [paid, done, refetch]);

  const run = useCallback(
    async (src: { file?: File; sample?: boolean }) => {
      lastInput.current = src;
      setError(null);
      setStage("scanning");
      setProgress(0);
      setThumb(null);
      const name = src.sample ? "Sample statement.pdf" : src.file!.name;
      setFileName(name);
      // preview of their own upload
      (async () => {
        if (src.sample) {
          const buf = await fetch("/sample-statement.pdf").then((r) => r.arrayBuffer());
          setThumb(await pdfThumb(buf));
        } else if (src.file!.type.startsWith("image/")) setThumb(URL.createObjectURL(src.file!));
        else setThumb(await pdfThumb(await src.file!.arrayBuffer()));
      })();

      const started = performance.now();
      let finished = false;
      const tick = () => {
        if (finished) return;
        const t = performance.now() - started;
        const p = Math.min(99, 99 * (1 - Math.exp(-t / (MIN_MS * 0.55))));
        setProgress(p);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      const send = async () => {
        const fd = new FormData();
        if (src.sample) fd.append("sample", "1");
        else fd.append("file", src.file!);
        return fetch("/api/scan", { method: "POST", body: fd });
      };
      let res: Response | null = null;
      try {
        res = await send();
        if (res.status >= 500) res = await send(); // retry once
      } catch {
        try {
          res = await send();
        } catch {
          res = null;
        }
      }
      const j = res ? await res.json().catch(() => null) : null;
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      await new Promise((r) => setTimeout(r, wait));
      finished = true;
      if (!res || !res.ok || !j?.result) {
        setStage("error");
        setError({
          msg: j?.error || "We couldn't read this file. Try again.",
          code: j?.code,
        });
        return;
      }
      setProgress(100);
      setStage("ready");
      fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "onboarding_done" }) }).catch(() => {});
      try {
        localStorage.setItem("bdg_last", JSON.stringify({ id: j.id }));
      } catch {}
      await new Promise((r) => setTimeout(r, reduce ? 200 : 1100));
      setDone(j);
      setStage("done");
      onScanned?.(j);
    },
    [onScanned, reduce],
  );

  const onFile = (f: File | undefined | null) => {
    if (!f) return;
    run({ file: f });
  };

  const stepIdx = Math.min(STEPS.length, Math.floor((progress / 100) * STEPS.length + 0.05));
  const locked = done && isLockedResult(done.result);

  return (
    <div className={cn(dark && "dark text-white")}>
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}>
            <label
              htmlFor="statement-input"
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                onFile(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[22px] border-2 border-dashed px-6 text-center transition",
                compact ? "py-10" : "py-12 sm:py-14",
                dark ? "border-white/20 bg-white/[0.04] hover:border-lime hover:bg-lime/[0.06]" : "border-fg/15 bg-surface hover:border-fg/40",
                drag && "scale-[1.01] border-lime bg-lime/10",
              )}
            >
              <span className={cn("grid h-14 w-14 place-items-center rounded-2xl transition group-hover:scale-105", dark ? "bg-lime text-ink" : "bg-fg text-bg")}>
                <Upload className="h-6 w-6" />
              </span>
              <span className="text-lg font-semibold">Drop your statement PDF</span>
              <span className={cn("text-sm", dark ? "text-white/60" : "text-muted")}>
                <span className="sm:hidden">Tap to choose a PDF or take a photo</span>
                <span className="hidden sm:inline">or click to choose a file · PDF or photo, up to 10 MB</span>
              </span>
              <input
                id="statement-input"
                ref={input}
                type="file"
                accept="application/pdf,image/*"
                className="sr-only"
                onChange={(e) => {
                  onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <button
                onClick={() => run({ sample: true })}
                className={cn("inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold transition active:scale-95", dark ? "bg-white text-ink hover:bg-white/90" : "bg-fg text-bg")}
              >
                <Sparkles className="h-4 w-4" /> Try a sample statement
              </button>
              <button
                onClick={() => input.current?.click()}
                className={cn("inline-flex h-11 items-center gap-2 text-sm font-medium sm:hidden", dark ? "text-white/70" : "text-muted")}
              >
                <Camera className="h-4 w-4" /> Photo of a paper statement
              </button>
            </div>
          </motion.div>
        )}

        {(stage === "scanning" || stage === "ready") && (
          <motion.div key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("rounded-[22px] border p-5 sm:p-7", dark ? "border-white/10 bg-white/[0.04]" : "border-line bg-surface")}>
            {stage === "ready" ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 11, stiffness: 220 }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-lime text-ink shadow-[0_0_40px_rgba(200,255,61,.5)]"
                >
                  <Check className="h-8 w-8" strokeWidth={3} />
                </motion.span>
                <p className="mt-5 text-2xl font-semibold tracking-tight">Your leak report is ready.</p>
              </div>
            ) : (
              <ScanFrame thumb={thumb} progress={progress} stepIdx={stepIdx} fileName={fileName} dark={dark} />
            )}
          </motion.div>
        )}

        {stage === "error" && error && (
          <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {error.code === "free_limit" || error.code === "quota" ? (
              <div className={cn("rounded-[22px] border p-6 text-center", dark ? "border-white/10 bg-white/[0.04]" : "border-line bg-surface")}>
                <Lock className="mx-auto h-6 w-6" />
                <p className="mt-3 font-medium">{error.msg}</p>
                <div className="mt-5 flex justify-center">
                  <MainButton compact label={error.code === "quota" ? "See the next plan" : "Unlock Budgeto"} onClick={() => (error.code === "quota" ? openUpgrade() : unlock())} />
                </div>
              </div>
            ) : (
              <ScanErrorBox
                message={error.msg}
                onRetry={() => (lastInput.current ? run(lastInput.current) : setStage("idle"))}
                onSample={() => run({ sample: true })}
              />
            )}
            <button onClick={() => setStage("idle")} className={cn("mx-auto mt-3 block text-sm underline-offset-4 hover:underline", dark ? "text-white/60" : "text-muted")}>
              Choose another file
            </button>
          </motion.div>
        )}

        {stage === "done" && done && (
          <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className={cn("rounded-[22px] border p-5 text-fg sm:p-7", dark ? "border-white/10 bg-night/80" : "border-line bg-bg")}>
            {welcome && locked && <p className="label-mono mb-4 text-lime">[ Welcome back · your report waited for you ]</p>}
            {!welcome && (
              <p className="mb-4 flex items-center gap-2 text-sm font-medium">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-lime text-ink">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                Your leak report is ready.
              </p>
            )}
            {locked ? (
              <>
                <LockedReport result={done.result as LockedResult} fileName={done.file_name} onUnlock={unlock} />
                <div className="mt-6 flex flex-col items-center gap-3">
                  <MainButton label="See my full leak report" onClick={unlock} className="w-full sm:w-auto" />
                  <button onClick={() => (setStage("idle"), setWelcome(false))} className="text-sm text-muted underline-offset-4 hover:underline">
                    Scan another statement
                  </button>
                </div>
              </>
            ) : (
              <motion.div initial={reduce ? false : { filter: "blur(10px)", opacity: 0.4 }} animate={{ filter: "blur(0px)", opacity: 1 }} transition={{ duration: 0.9 }}>
                <FullReport result={done.result as ReportResult} onLockedFees={() => openUpgrade(2)} />
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href={`/reports/${done.id}`} className="inline-flex h-11 items-center rounded-full bg-fg px-5 text-sm font-semibold text-bg">
                    Open in my account
                  </Link>
                  <button onClick={() => setStage("idle")} className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-medium">
                    Scan another statement
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {sticky && locked && authed && stage === "done" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 text-fg backdrop-blur md:hidden">
          <button onClick={unlock} className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-lime text-[15px] font-semibold text-ink active:scale-[0.98]">
            <Lock className="h-4 w-4" /> See my full leak report{minPerDay ? ` · ${minPerDay}/day` : ""}
          </button>
        </div>
      )}
    </div>
  );
}
