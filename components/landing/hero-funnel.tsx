"use client";
import { useState } from "react";
import { Scanner } from "@/components/funnel/scanner";
import { UnlockProvider } from "@/components/funnel/unlock";
import type { LockedResult } from "@/lib/types";

function personalLine(r: { result: unknown; file_name: string }) {
  const res = r.result as LockedResult;
  if (!res || !("locked" in res)) return undefined;
  const n = res.leaks_count + res.fees_count;
  const where = res.bank ? res.bank : "your statement";
  if (n === 0) return `We read all ${res.transactions_count} transactions in ${where}.`;
  return `We found ${n} recurring ${n === 1 ? "charge" : "charges"} in ${where}${res.first_leak ? ` — ${res.first_leak.merchant} is just one of them.` : "."}`;
}

/** The hero IS the product: drop zone → scan → locked report → sign-up sheet → paywall → checkout, without leaving the page. */
export function HeroFunnel({ authed, paid }: { authed: boolean; paid: boolean }) {
  const [personal, setPersonal] = useState<string | undefined>();
  return (
    <UnlockProvider authed={authed} paid={paid} personal={personal}>
      <Scanner dark onScanned={(d) => setPersonal(personalLine(d))} />
    </UnlockProvider>
  );
}
