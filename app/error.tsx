"use client";
import { useEffect } from "react";
import { Logo } from "@/components/ui/logo";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-5 text-center">
      <Logo />
      <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.03em]">Something went wrong on our side.</h1>
      <p className="text-muted">Your reports are safe. Try again in a moment.</p>
      <button onClick={reset} className="mt-2 inline-flex h-12 items-center rounded-full bg-fg px-6 font-semibold text-bg">
        Try again
      </button>
    </main>
  );
}
