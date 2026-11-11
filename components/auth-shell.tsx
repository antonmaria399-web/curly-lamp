import Link from "next/link";
import { KwopFlow } from "./kwop-flow";
import { Logo } from "@/components/ui/logo";

/** Centered card on a calm background (sign-up, log-in, password). */
export function AuthShell({ title, sub, children, track = true }: { title: string; sub?: string; children: React.ReactNode; track?: boolean }) {
  return (
    <main className="relative flex min-h-dvh flex-col bg-bg">
      <div className="dot-grid-ink pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000,transparent)] dark:opacity-0" />
      <header className="relative px-5 py-5">
        <Link href="/?home=1" aria-label="Budgeto home">
          <Logo />
        </Link>
      </header>
      <div className="relative flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-[420px] rounded-[24px] border border-line bg-surface p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,.3)] sm:p-8">
          <h1 className="text-[28px] font-semibold tracking-[-0.03em]">{title}</h1>
          {sub && <p className="mt-1.5 text-[15px] text-muted">{sub}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
      {track && <KwopFlow />}
    </main>
  );
}
