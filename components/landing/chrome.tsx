import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { CTA } from "./bits";

/** `home`: on "/" the menu scrolls within the page; elsewhere it links back to the home sections. */
export function TopBar({ home = true }: { home?: boolean }) {
  const h = home ? "" : "/";
  return (
    <header className="fixed inset-x-0 top-[14px] z-50 px-4">
      <nav className="mx-auto flex h-14 max-w-[980px] items-center justify-between rounded-[24px] bg-[#0b0c0b]/70 pl-4 pr-2 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.09)] backdrop-blur-xl">
        <Link href="/" aria-label="Budgeto home">
          <Logo dark />
        </Link>
        <div className="hidden items-center gap-7 text-[14px] text-white/70 md:flex">
          <a href={`${h}#how`} className="transition hover:text-white">How it works</a>
          <a href={`${h}#features`} className="transition hover:text-white">Features</a>
          <Link href="/guides" className="transition hover:text-white">Guides</Link>
          <a href={`${h}#faq`} className="transition hover:text-white">Questions</a>
        </div>
        <div className="flex items-center gap-1.5">
          <Link href="/login" className="whitespace-nowrap rounded-full px-2.5 py-2 text-[14px] font-medium text-white/80 transition hover:text-white sm:px-3">
            Log in
          </Link>
          <CTA compact />
        </div>
      </nav>
    </header>
  );
}

const COMPARE = [
  ["/bank-statement-analyzer", "Bank statement analyzer"],
  ["/rocket-money-alternative", "Rocket Money alternative"],
  ["/vs/ynab", "YNAB vs Budgeto"],
  ["/vs/copilot", "Copilot Money vs Budgeto"],
  ["/for/college-students", "For college students"],
];
const GUIDES = [
  ["/guides/find-forgotten-subscriptions", "Find forgotten subscriptions"],
  ["/guides/stop-recurring-charges", "Stop recurring charges"],
  ["/guides/get-bank-fees-waived", "Get bank fees waived"],
  ["/guides", "All guides"],
];

export function Footer({ home = true }: { home?: boolean }) {
  const h = home ? "" : "/";
  return (
    <footer className="relative overflow-hidden bg-night pb-24 pt-20 text-white md:pb-0">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Logo dark />
          <p className="mt-3 max-w-xs text-sm text-white/60">Stop wondering where your paycheck went.</p>
        </div>
        <nav aria-label="Product" className="space-y-2.5 text-sm">
          <div className="label-mono text-white/55">[ Product ]</div>
          <a href={`${h}#how`} className="block text-white/70 hover:text-white">How it works</a>
          <a href={`${h}#features`} className="block text-white/70 hover:text-white">Features</a>
          <a href={`${h}#faq`} className="block text-white/70 hover:text-white">Questions</a>
          <Link href="/login" className="block text-white/70 hover:text-white">Log in</Link>
        </nav>
        <nav aria-label="Compare" className="space-y-2.5 text-sm">
          <div className="label-mono text-white/55">[ Compare ]</div>
          {COMPARE.map(([href, label]) => (
            <Link key={href} href={href} className="block text-white/70 hover:text-white">{label}</Link>
          ))}
        </nav>
        <nav aria-label="Guides" className="space-y-2.5 text-sm">
          <div className="label-mono text-white/55">[ Guides ]</div>
          {GUIDES.map(([href, label]) => (
            <Link key={href} href={href} className="block text-white/70 hover:text-white">{label}</Link>
          ))}
        </nav>
        <nav aria-label="Legal" className="space-y-2.5 text-sm">
          <div className="label-mono text-white/55">[ Legal ]</div>
          <Link href="/terms" className="block text-white/70 hover:text-white">Terms</Link>
          <Link href="/privacy" className="block text-white/70 hover:text-white">Privacy</Link>
          <span className="block text-white/55">© {new Date().getFullYear()} Budgeto</span>
        </nav>
      </div>
      <div
        aria-hidden
        className="pointer-events-none mt-16 select-none text-center text-[23vw] font-bold leading-[0.8] tracking-[-0.06em] text-white"
        style={{ opacity: 0.13, maskImage: "linear-gradient(180deg,#000 30%,transparent 95%)", WebkitMaskImage: "linear-gradient(180deg,#000 30%,transparent 95%)" }}
      >
        Budgeto
      </div>
    </footer>
  );
}
