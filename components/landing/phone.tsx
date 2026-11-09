"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

function useClock() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => {
    setT(new Date());
    const i = setInterval(() => setT(new Date()), 15000);
    return () => clearInterval(i);
  }, []);
  return t;
}

/** A realistic iPhone drawn in CSS: rounded frame, dynamic island, status bar with the live time. */
export function Phone({ children, className, dark = true, lock }: { children?: React.ReactNode; className?: string; dark?: boolean; lock?: boolean }) {
  const t = useClock();
  const hm = t ? t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).replace(/\s?[AP]M/, "") : "9:41";
  return (
    <div className={cn("relative mx-auto aspect-[9/19.5] w-[260px] rounded-[46px] bg-[#1a1a1a] p-[10px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.6),inset_0_0_0_1.5px_rgba(255,255,255,.12)]", className)}>
      <div className={cn("relative h-full w-full overflow-hidden rounded-[37px]", dark ? "bg-[#0b0c0b] text-white" : "bg-[#f6f6f4] text-ink")}>
        <div className="absolute left-1/2 top-2.5 z-20 h-[26px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
        <div className="relative z-10 flex items-center justify-between px-7 pt-3.5 text-[12px] font-semibold">
          <span className="num">{hm}</span>
          <span className="flex items-center gap-1">
            <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
              <rect x="0" y="6" width="3" height="4" rx="1" fill="currentColor" />
              <rect x="4.3" y="4" width="3" height="6" rx="1" fill="currentColor" />
              <rect x="8.6" y="2" width="3" height="8" rx="1" fill="currentColor" />
              <rect x="12.9" y="0" width="3" height="10" rx="1" fill="currentColor" />
            </svg>
            <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden>
              <rect x=".5" y=".5" width="18" height="10" rx="3" fill="none" stroke="currentColor" opacity=".5" />
              <rect x="2" y="2" width="13" height="7" rx="1.6" fill="currentColor" />
              <rect x="19.5" y="3.5" width="1.5" height="4" rx=".7" fill="currentColor" opacity=".5" />
            </svg>
          </span>
        </div>
        {lock && t && (
          <div className="mt-6 text-center">
            <div className="text-[13px] font-medium opacity-80">{t.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
            <div className="num text-[64px] font-semibold leading-none tracking-tight">{hm}</div>
          </div>
        )}
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}

/** A browser window frame for the computer view. */
export function Browser({ children, className, url = "budgeto.app" }: { children: React.ReactNode; className?: string; url?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,.35)]", className)}>
      <div className="flex items-center gap-2 border-b border-black/5 bg-zinc-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="num ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-center text-[11px] text-zinc-500">{url}</span>
      </div>
      {children}
    </div>
  );
}
