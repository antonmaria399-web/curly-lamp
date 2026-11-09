import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-5 text-center">
      <Logo />
      <h1 className="mt-6 text-[32px] font-semibold tracking-[-0.03em]">This page doesn&apos;t exist.</h1>
      <p className="text-muted">The link may be old, or the report was deleted.</p>
      <Link href="/" className="mt-2 inline-flex h-12 items-center rounded-full bg-lime px-6 font-semibold text-ink">
        Find my leaks
      </Link>
    </main>
  );
}
