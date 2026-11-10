import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export const metadata = { title: "Page not found", robots: { index: false } };

/** A real 404 (status 404, noindex) that still helps: the main button plus the pages people look for. */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-5 py-16 text-center">
      <Logo />
      <p className="label-mono mt-6 text-muted">[ 404 ]</p>
      <h1 className="text-[32px] font-semibold tracking-[-0.03em]">This page doesn&apos;t exist.</h1>
      <p className="text-muted">The link may be old, or the report was deleted.</p>
      <Link href="/" className="mt-2 inline-flex h-12 items-center rounded-full bg-lime px-6 font-semibold text-ink">
        Find my leaks
      </Link>
      <nav aria-label="Popular pages" className="mt-8 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted">
        <Link href="/guides/find-forgotten-subscriptions" className="underline-offset-4 hover:text-fg hover:underline">Find forgotten subscriptions</Link>
        <Link href="/guides/stop-recurring-charges" className="underline-offset-4 hover:text-fg hover:underline">Stop recurring charges</Link>
        <Link href="/guides/get-bank-fees-waived" className="underline-offset-4 hover:text-fg hover:underline">Get bank fees waived</Link>
        <Link href="/bank-statement-analyzer" className="underline-offset-4 hover:text-fg hover:underline">Bank statement analyzer</Link>
        <Link href="/guides" className="underline-offset-4 hover:text-fg hover:underline">All guides</Link>
      </nav>
    </main>
  );
}
