import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { CTA } from "./bits";
import { AUDIENCES, COMPETITORS } from "@/lib/seo";

const FOR_LINKS = AUDIENCES.slice(0, 5).map((a) => [a.slug, a.short] as const);
const VS_LINKS = COMPETITORS.map((c) => [c.slug, c.name] as const);

export function TopBar() {
  return (
    <header className="fixed inset-x-0 top-[14px] z-50 px-4">
      <nav className="mx-auto flex h-14 max-w-[980px] items-center justify-between rounded-[24px] bg-[#0b0c0b]/70 pl-4 pr-2 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.09)] backdrop-blur-xl">
        <Link href="/" aria-label="Budgeto home">
          <Logo dark />
        </Link>
        <div className="hidden items-center gap-7 text-[14px] text-white/70 md:flex">
          <Link href="/#how" className="transition hover:text-white">How it works</Link>
          <Link href="/#features" className="transition hover:text-white">Features</Link>
          <Link href="/#privacy" className="transition hover:text-white">Privacy</Link>
          <Link href="/#faq" className="transition hover:text-white">Questions</Link>
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

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night pb-24 pt-20 text-white md:pb-0">
      <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-10 px-5 sm:px-8 md:grid-cols-6">
        <div className="col-span-2">
          <Logo dark />
          <p className="mt-3 max-w-xs text-sm text-white/50">Stop wondering where your paycheck went.</p>
          <Link href="/creators" className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-lime hover:text-white">
            Creators: get paid to post
          </Link>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="label-mono text-white/40">[ Product ]</div>
          <Link href="/#how" className="block text-white/70 hover:text-white">How it works</Link>
          <Link href="/#features" className="block text-white/70 hover:text-white">Features</Link>
          <Link href="/#faq" className="block text-white/70 hover:text-white">Questions</Link>
          <Link href="/tools/subscription-calculator" className="block text-white/70 hover:text-white">Subscription calculator</Link>
          <Link href="/login" className="block text-white/70 hover:text-white">Log in</Link>
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="label-mono text-white/40">[ Made for ]</div>
          {FOR_LINKS.map(([slug, label]) => (
            <Link key={slug} href={`/for/${slug}`} className="block text-white/70 hover:text-white">{label}</Link>
          ))}
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="label-mono text-white/40">[ Compare ]</div>
          {VS_LINKS.map(([slug, label]) => (
            <Link key={slug} href={`/vs/${slug}`} className="block text-white/70 hover:text-white">Budgeto vs {label}</Link>
          ))}
        </div>
        <div className="space-y-2.5 text-sm">
          <div className="label-mono text-white/40">[ Legal ]</div>
          <Link href="/terms" className="block text-white/70 hover:text-white">Terms</Link>
          <Link href="/privacy" className="block text-white/70 hover:text-white">Privacy</Link>
          <Link href="/creators" className="block text-white/70 hover:text-white">Creators</Link>
          <span className="block text-white/40">© {new Date().getFullYear()} Budgeto</span>
        </div>
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
