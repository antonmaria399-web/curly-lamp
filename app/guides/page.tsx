import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PAGES, pageMetadata } from "@/lib/seo/site";
import { SeoPage } from "@/components/seo/blocks";

const PATH = "/guides";
export const metadata = pageMetadata(PATH);

function List({ section }: { section: "guides" | "compare" | "for" }) {
  return (
    <ul className="not-prose mt-6 grid gap-3">
      {PAGES.filter((p) => p.section === section).map((p) => (
        <li key={p.path}>
          <Link href={p.path} className="group flex items-start justify-between gap-4 rounded-2xl border border-black/[0.08] bg-white p-5 transition hover:border-black/20">
            <span>
              <span className="block text-[18px] font-semibold tracking-tight text-ink">{p.title.replace(/ · Budgeto$/, "")}</span>
              <span className="mt-1 block text-[15px] leading-snug text-zinc-600">{p.description}</span>
            </span>
            <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <SeoPage
      path={PATH}
      label="Guides"
      h1="Guides to stop the money leaks"
      answer={
        <p>
          Plain-English, step-by-step guides to <b className="font-semibold text-white">find forgotten subscriptions, stop recurring charges and get bank fees refunded</b>, with
          the official sources they rely on. Or skip the reading: drop a statement below and see your own leaks in seconds.
        </p>
      }
      related={["/bank-statement-analyzer", "/rocket-money-alternative"]}
    >
      <h2>How-to guides</h2>
      <List section="guides" />
      <h2>Compare</h2>
      <p>Honest comparisons with the apps people already pay for, with sources for every fact about them.</p>
      <List section="compare" />
      <h2>For you</h2>
      <List section="for" />
    </SeoPage>
  );
}
