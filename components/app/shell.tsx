"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Upload, Droplets, Settings, CircleUser, Lock } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";
import { UnlockProvider, useUnlock } from "@/components/funnel/unlock";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/leaks", label: "Leaks", icon: Droplets },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/account", label: "Account", icon: CircleUser },
];

function PlanBadge({ planName }: { planName: string | null }) {
  const { paid, unlock } = useUnlock();
  if (paid && planName) return <div className="label-mono rounded-full bg-lime px-3 py-1.5 text-center text-ink">[ {planName} ]</div>;
  return (
    <button onClick={unlock} className="flex w-full items-center justify-center gap-2 rounded-full bg-fg py-2.5 text-sm font-semibold text-bg active:scale-[0.98]">
      <Lock className="h-3.5 w-3.5" /> Unlock Budgeto
    </button>
  );
}

export function AppShell({ children, paid, tier, planName, email }: { children: React.ReactNode; paid: boolean; tier: number; planName: string | null; email: string }) {
  const path = usePathname();
  const router = useRouter();
  return (
    <UnlockProvider authed paid={paid} currentTier={tier} onUnlocked={() => router.refresh()}>
      <div className="min-h-dvh bg-bg md:flex">
        <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-line px-4 py-5 md:flex">
          <Link href="/dashboard" className="px-2">
            <Logo />
          </Link>
          <nav className="mt-8 space-y-1">
            {NAV.map((n) => {
              const active = path === n.href || path.startsWith(n.href + "/") || (n.href === "/leaks" && path.startsWith("/reports"));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2/60 hover:text-fg")}
                >
                  <n.icon className="h-[18px] w-[18px]" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3">
            <PlanBadge planName={planName} />
            <p className="truncate px-2 text-xs text-muted">{email}</p>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-bg/85 px-4 backdrop-blur md:hidden">
            <Link href="/dashboard">
              <Logo />
            </Link>
            {paid && planName ? <span className="label-mono rounded-full bg-lime px-2.5 py-1 text-ink">[ {planName} ]</span> : null}
          </header>
          <main className="mx-auto w-full max-w-[880px] px-4 pb-32 pt-6 sm:px-8 md:pb-16 md:pt-10">{children}</main>
        </div>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          {NAV.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/") || (n.href === "/leaks" && path.startsWith("/reports"));
            return (
              <Link key={n.href} href={n.href} className={cn("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition", active ? "text-fg" : "text-muted")}>
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition", active && "bg-lime text-ink")}>
                  <n.icon className="h-[18px] w-[18px]" />
                </span>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </UnlockProvider>
  );
}
