"use client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/** After Google: attach the device's try to the account, then land exactly where they were (open the paywall if they were unlocking). */
export default function AuthDone() {
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    let next = p.get("next") || "/dashboard";
    if (!next.startsWith("/") || next.startsWith("//")) next = "/dashboard";
    fetch("/api/claim", { method: "POST" })
      .catch(() => null)
      .finally(() => {
        if (next === "/" || next.startsWith("/?")) next = "/dashboard?unlock=1";
        location.replace(next);
      });
  }, []);
  return (
    <main className="grid min-h-dvh place-items-center bg-bg text-muted">
      <Loader2 className="h-6 w-6 animate-spin" />
    </main>
  );
}
