import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Legal({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-bg">
      <header className="mx-auto max-w-[720px] px-5 py-6">
        <Link href="/?home=1">
          <Logo />
        </Link>
      </header>
      <article className="mx-auto max-w-[720px] px-5 pb-24 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mt-1.5 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-muted [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted">
        <h1 className="text-[36px] font-semibold tracking-[-0.03em]">{title}</h1>
        <p className="num !mt-2 text-sm">Last updated {updated}</p>
        {children}
      </article>
    </main>
  );
}
