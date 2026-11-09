import { ImageResponse } from "next/og";
import { usd } from "./cn";

const LIME = "#C8FF3D";

export function slideImage(lines: { top: string; big: string; bottom: string }, size: { width: number; height: number }) {
  const tall = size.height > size.width;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#060606", color: "white", position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: tall ? 700 : 300, display: "flex", background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(200,255,61,.22), transparent 70%)" }} />
        <div style={{ fontSize: tall ? 58 : 40, color: "rgba(255,255,255,.65)", display: "flex" }}>{lines.top}</div>
        <div style={{ fontSize: tall ? 190 : 140, fontWeight: 800, color: LIME, letterSpacing: -6, margin: tall ? "24px 0" : "8px 0", display: "flex" }}>{lines.big}</div>
        <div style={{ fontSize: tall ? 58 : 40, color: "rgba(255,255,255,.65)", display: "flex" }}>{lines.bottom}</div>
        <div style={{ position: "absolute", bottom: tall ? 110 : 48, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: tall ? 64 : 44, height: tall ? 64 : 44, borderRadius: 16, background: LIME, color: "#0A0B0A", fontSize: tall ? 42 : 30, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>B</div>
          <div style={{ fontSize: tall ? 46 : 32, fontWeight: 700, display: "flex" }}>Budgeto</div>
        </div>
      </div>
    ),
    size,
  );
}

export function slidesFor(r: { monthly_leaks: number; yearly_leaks: number; leaks: { merchant: string; monthly: number }[]; fees: unknown[] }) {
  const n = r.leaks.length;
  const top = r.leaks[0];
  return [
    { top: "I was leaking", big: usd(r.monthly_leaks), bottom: "every single month" },
    { top: `${n} ${n === 1 ? "subscription" : "subscriptions"}`, big: `${n}×`, bottom: "renewing without me noticing" },
    top ? { top: "The biggest one?", big: usd(top.monthly), bottom: `${top.merchant}, every month` } : { top: "Bank fees", big: `${r.fees.length}`, bottom: "I didn't know about" },
    { top: "That's", big: usd(r.yearly_leaks, 0), bottom: "a year I can keep" },
    { top: "Found in seconds with", big: "Budgeto", bottom: "drop your statement PDF" },
  ];
}
