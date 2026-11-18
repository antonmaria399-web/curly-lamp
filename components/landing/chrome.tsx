import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { CTA } from "./bits";
import { AUDIENCES, COMPETITORS } from "@/lib/pages-content";

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

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["How it works", "/#how"],
      ["Features", "/#features"],
      ["Questions", "/#faq"],
      ["Free subscription calculator", "/tools/subscription-calculator"],
      ["Log in", "/login"],
    ],
  },
  {
    title: "Made for",
    links: AUDIENCES.map((a) => [a.label, `/for/${a.slug}`] as [string, string]),
  },
  {
    title: "Compare",
    links: [...COMPETITORS.map((c) => [`Budgeto vs ${c.name}`, `/vs/${c.slug}`] as [string, string]), ["Creators: get paid to post", "/creators"]],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "/terms"],
      ["Privacy", "/privacy"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night pb-24 pt-20 text-white md:pb-0">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-5 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr_1fr_0.7fr]">
        <div className="col-span-2 md:col-span-1">
          <Logo dark />
          <p className="mt-3 max-w-xs text-sm text-white/50">Stop wondering where your paycheck went.</p>
          <p className="mt-4 text-sm text-white/40">© {new Date().getFullYear()} Budgeto</p>
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-10 md:col-span-4 md:grid-cols-4">
          {COLS.map((c) => (
            <div key={c.title} className="space-y-2.5 text-sm">
              <div className="label-mono text-white/40">[ {c.title} ]</div>
              {c.links.map(([l, h]) => (
                <Link key={h} href={h} className="block text-white/70 transition hover:text-white">
                  {l}
                </Link>
              ))}
            </div>
          ))}
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
