import { isValidElement } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Lock, Minus, Repeat, X } from "lucide-react";
import { TopBar, Footer } from "@/components/landing/chrome";
import { HeroFunnel } from "@/components/landing/hero-funnel";
import { StickyCTA } from "@/components/landing/bits";
import { getViewer } from "@/lib/viewer";
import { getPlans } from "@/lib/kwop";
import { JsonLd, breadcrumbList, crumbs, faqPage, organization, softwareApp, article } from "@/lib/seo/jsonld";
import { fmtDate, page } from "@/lib/seo/site";
import sample from "@/lib/seo/sample-report.json";
import type { ReportResult } from "@/lib/types";
import { normalizeMerchant } from "@/lib/engine";

export const SAMPLE = sample.result as ReportResult;
export const SAMPLE_RAW = sample.raw as { date: string; description: string; amount: number }[];
const usd = (n: number) => "$" + n.toFixed(2);

/* ---------------------------------------------------------------- page frame */

type Faq = { q: string; a: string }[];

/**
 * Every public SEO page: dark hero (breadcrumb, H1, the answer, the live scanner), the body, FAQ, related pages,
 * footer; plus Organization, BreadcrumbList, FAQPage, SoftwareApplication (and Article for guides) as JSON-LD.
 */
export async function SeoPage({
  path,
  label,
  h1,
  answer,
  children,
  faq,
  related,
  prices = false,
}: {
  path: string;
  label: string;
  h1: React.ReactNode;
  answer: React.ReactNode;
  children: React.ReactNode;
  faq?: Faq;
  related: string[];
  prices?: boolean;
}) {
  const p = page(path);
  const viewer = await getViewer();
  const guide = path.startsWith("/guides/");
  const ld = [organization(), breadcrumbList(path), await softwareApp({ withPrices: prices, path })];
  if (faq?.length) ld.push(faqPage(faq));
  if (guide) ld.push(article(path));
  return (
    <main className="bg-night text-white">
      <JsonLd data={ld} />
      <TopBar home={false} />
      <section className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36">
        <div className="dot-grid pointer-events-none absolute inset-0" />
        <div className="top-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[1120px] px-4 sm:px-8">
          <div className="mx-auto max-w-[780px]">
            <Breadcrumbs path={path} />
            <span className="label-mono mt-8 block text-white/60">[ {label} ]</span>
            <h1 className="title-xl hero-rise mt-4 text-[36px] sm:text-[58px]">{h1}</h1>
            <div className="mt-5 max-w-[680px] text-[17px] leading-relaxed text-white/75 sm:text-[19px]">{answer}</div>
            {guide && (
              <p className="mt-4 text-[13px] text-white/55">
                By the Budgeto team · Updated <time dateTime={p.updated}>{fmtDate(p.updated)}</time>
              </p>
            )}
          </div>
          <TryBox authed={Boolean(viewer.user)} paid={viewer.plan.paid} />
        </div>
      </section>
      <div className="bg-paper text-ink">
        <div className="mx-auto max-w-[780px] px-5 py-16 sm:px-8 sm:py-24">
          <article className="prose-b">{children}</article>
          {faq?.length ? (
            <section className="mt-16" aria-labelledby="faq">
              <h2 id="faq" className="text-[28px] font-semibold tracking-[-0.03em] sm:text-[34px]">
                Questions
              </h2>
              <FaqList items={faq} />
            </section>
          ) : null}
          <Related paths={related} />
        </div>
      </div>
      <section className="relative overflow-hidden py-24 text-center">
        <div className="top-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-[680px] px-5">
          <h2 className="title-xl text-[34px] sm:text-[52px]">
            Tonight, find out <span className="grad-text">where your paycheck goes.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/65">Grab last month&apos;s PDF. Five seconds later, you know what to cancel.</p>
          <a href="#scan" className="btn-main mt-8 inline-flex h-16 items-center justify-between gap-4 rounded-full bg-lime pl-7 pr-2 text-[17px] font-semibold text-ink">
            <span>Find my leaks</span>
            <span className="btn-arrow grid h-12 w-12 place-items-center rounded-full bg-ink text-lime">
              <ArrowRight className="h-5 w-5" />
            </span>
          </a>
        </div>
      </section>
      <Footer home={false} />
      <StickyCTA />
    </main>
  );
}

function Breadcrumbs({ path }: { path: string }) {
  const list = crumbs(path);
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/60">
        {list.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i === list.length - 1 ? (
              <span aria-current="page" className="text-white/85">{c.name}</span>
            ) : (
              <Link href={c.path} className="hover:text-white">{c.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The product itself, the same drop zone as the home page: the main button of every page scrolls here. */
export function TryBox({ authed, paid }: { authed: boolean; paid: boolean }) {
  return (
    <div className="mx-auto mt-10 max-w-[760px]">
      <div id="scan" className="scroll-mt-28 rounded-[26px]">
        <HeroFunnel authed={authed} paid={paid} />
      </div>
      <p className="num mt-5 text-center text-[12px] uppercase tracking-[0.14em] text-white/55">Free to try · No bank login · No card · Ready in seconds</p>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[13px] text-white/55">
        <Lock className="h-3.5 w-3.5" /> Your file is read once and never stored. Delete your report anytime.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- content blocks */

/** All answers are in the HTML (no JS needed), so the FAQPage markup matches what readers can see. */
export function FaqList({ items }: { items: Faq }) {
  return (
    <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
      {items.map((f, i) => (
        <details key={f.q} className="group" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[17px] font-medium [&::-webkit-details-marker]:hidden">
            <h3 className="text-[17px] font-medium">{f.q}</h3>
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="pb-5 pr-8 text-[15px] leading-relaxed text-zinc-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

function Related({ paths }: { paths: string[] }) {
  return (
    <nav className="mt-16" aria-labelledby="related">
      <h2 id="related" className="label-mono text-zinc-500">[ Keep reading ]</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {paths.map((p) => {
          const x = page(p);
          return (
            <li key={p}>
              <Link href={p} className="group flex h-full items-start justify-between gap-3 rounded-2xl border border-black/[0.08] bg-white p-5 transition hover:border-black/20">
                <span>
                  <span className="block font-semibold tracking-tight">{x.name}</span>
                  <span className="mt-1 block text-[14px] leading-snug text-zinc-600">{x.description.split(". ")[0]}.</span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Real output of Budgeto's engine on the bundled example statement (lib/seo/sample-report.json). */
export function SampleLeaks({ limit = 13, caption = true, only }: { limit?: number; caption?: boolean; only?: string[] }) {
  const all = [...SAMPLE.leaks, ...SAMPLE.fees];
  const rows = (only ? all.filter((l) => only.includes(l.merchant)) : all).slice(0, limit);
  const sum = rows.reduce((a, l) => a + l.monthly, 0);
  const total = only ? Math.round(sum * 100) / 100 : SAMPLE.monthly_leaks;
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-[22px] border border-black/[0.08] bg-white">
      <div className="flex items-center justify-between border-b border-black/[0.06] bg-zinc-50 px-5 py-3 text-[12px] text-zinc-500">
        <span className="label-mono whitespace-nowrap">[ Example report ]</span>
        <span className="num whitespace-nowrap">{SAMPLE.transactions_count} transactions read</span>
      </div>
      <ul>
        {rows.map((l) => (
          <li key={l.key} className="flex items-center gap-3 border-b border-black/[0.05] px-5 py-3 text-[14px] last:border-0">
            <span className="min-w-0">
              <span className="block truncate font-medium">{l.merchant}</span>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600">
                <Repeat className="h-3 w-3" aria-hidden /> {l.kind === "fee" ? "bank fee" : l.cadence}
              </span>
            </span>
            <span className="ledger-leader" aria-hidden />
            <span className="num shrink-0 font-semibold text-[#e11d48]">−{usd(l.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-black/[0.08] bg-zinc-50 px-5 py-4">
        <span className="text-[14px] font-medium">{only ? "These charges" : "Total in leaks"}</span>
        <span className="num text-[22px] font-semibold tracking-tight">
          {usd(total)}
          <span className="whitespace-nowrap text-[14px] font-normal text-zinc-500"> / mo · {usd(Math.round(total * 1200) / 100)} / yr</span>
        </span>
      </div>
      {caption && (
        <figcaption className="border-t border-black/[0.06] px-5 py-3 text-[12px] leading-relaxed text-zinc-500">
          Real output of Budgeto&apos;s scan on its example statement (&ldquo;Sample Community Bank&rdquo;, {SAMPLE.period}), the one behind &ldquo;Try a sample statement&rdquo; above. Not a real
          customer&apos;s account.
        </figcaption>
      )}
    </figure>
  );
}

/** "What your bank wrote" vs "what Budgeto calls it", from the same example statement. */
export function DecodeTable({ only }: { only?: string[] }) {
  const seen = new Set<string>();
  const rows: { raw: string; name: string; amount: number; kind: string }[] = [];
  for (const l of [...SAMPLE.leaks, ...SAMPLE.fees]) {
    if (only && !only.includes(l.merchant)) continue;
    const raw = SAMPLE_RAW.find((r) => normalizeMerchant(r.description) === l.key);
    if (!raw || seen.has(raw.description)) continue;
    seen.add(raw.description);
    rows.push({ raw: raw.description, name: l.merchant, amount: l.amount, kind: l.kind === "fee" ? "Bank fee" : l.kind === "subscription" ? "Subscription" : "Recurring charge" });
  }
  return (
    <div className="not-prose my-8 overflow-x-auto rounded-[22px] border border-black/[0.08] bg-white">
      <table className="w-full min-w-[520px] text-left text-[14px]">
        <caption className="sr-only">Statement descriptions decoded by Budgeto</caption>
        <thead className="bg-zinc-50 text-[12px] text-zinc-500">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">What the statement says</th>
            <th scope="col" className="px-5 py-3 font-medium">What it is</th>
            <th scope="col" className="px-5 py-3 text-right font-medium">Each time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.raw} className="border-t border-black/[0.05]">
              <td className="num px-5 py-3 text-[12.5px] text-zinc-600">{r.raw}</td>
              <td className="px-5 py-3">
                <span className="font-medium">{r.name}</span> <span className="text-zinc-500">· {r.kind}</span>
              </td>
              <td className="num px-5 py-3 text-right">{usd(r.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Cell = string | React.ReactElement | { yes: string } | { no: string } | { meh: string };

/** A comparison table; each fact about another app carries its source (see the "Sources" list on the page). */
export function CompareTable({ them, rows }: { them: string; rows: [string, Cell, Cell][] }) {
  const cell = (c: Cell) => {
    if (typeof c === "string") return <span>{c}</span>;
    if (isValidElement(c)) return <span>{c}</span>;
    if ("yes" in c)
      return (
        <span className="flex items-start gap-1.5">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" strokeWidth={3} aria-label="Yes" />
          {c.yes}
        </span>
      );
    if ("no" in c)
      return (
        <span className="flex items-start gap-1.5">
          <X className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" aria-label="No" />
          {c.no}
        </span>
      );
    return (
      <span className="flex items-start gap-1.5">
        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-label="Partly" />
        {c.meh}
      </span>
    );
  };
  return (
    <>
      {/* Phones: one card per row, both answers visible without side-scrolling. */}
      <dl className="not-prose my-8 divide-y divide-black/[0.06] overflow-hidden rounded-[22px] border border-black/[0.08] bg-white sm:hidden">
        {rows.map(([label, a, b]) => (
          <div key={label} className="px-4 py-4 text-[14px]">
            <dt className="font-semibold">{label}</dt>
            <dd className="mt-2 grid grid-cols-[76px_1fr] gap-2 text-zinc-600">
              <span className="text-[12px] font-medium text-zinc-500">{them}</span>
              {cell(a)}
            </dd>
            <dd className="mt-1.5 grid grid-cols-[76px_1fr] gap-2">
              <span className="text-[12px] font-semibold">Budgeto</span>
              {cell(b)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="not-prose my-8 hidden overflow-hidden rounded-[22px] border border-black/[0.08] bg-white sm:block">
        <table className="w-full text-left text-[14px]">
          <caption className="sr-only">{them} compared with Budgeto</caption>
          <thead className="bg-zinc-50 text-[13px]">
            <tr>
              <th scope="col" className="w-[26%] px-5 py-3 font-medium text-zinc-500">
                <span className="sr-only">Feature</span>
              </th>
              <th scope="col" className="px-5 py-3 font-semibold text-zinc-600">{them}</th>
              <th scope="col" className="px-5 py-3 font-semibold">Budgeto</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, a, b]) => (
              <tr key={label} className="border-t border-black/[0.05] align-top">
                <th scope="row" className="px-5 py-3.5 font-medium">{label}</th>
                <td className="px-5 py-3.5 text-zinc-600">{cell(a)}</td>
                <td className="px-5 py-3.5">{cell(b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/** Budgeto's plans, read live from Kwop (never hardcoded). Shown where a comparison needs the price. */
export async function BudgetoPrices() {
  const { plans } = await getPlans();
  if (!plans.length) return <>Free to try. Paid plans are shown once your first leak report is ready.</>;
  const fmt = (c: number) => "$" + (c % 100 === 0 ? (c / 100).toFixed(0) : (c / 100).toFixed(2));
  return (
    <>
      Free to try (your first leak is shown, the full report is locked).{" "}
      {plans.map((p, i) => (
        <span key={p.id}>
          {i > 0 && " · "}
          {p.name.replace(/^Budgeto\s+/, "")} {fmt(p.price_cents)}/mo{p.yearly ? ` or ${fmt(p.yearly.price_cents)}/yr` : ""}
        </span>
      ))}
      . Cancel anytime.
    </>
  );
}

export async function lowestPrice(): Promise<string | null> {
  const { plans } = await getPlans();
  if (!plans.length) return null;
  const c = plans[0].price_cents;
  return "$" + (c % 100 === 0 ? (c / 100).toFixed(0) : (c / 100).toFixed(2));
}

export function Sources({ items }: { items: [string, string][] }) {
  return (
    <aside className="not-prose mt-10 rounded-2xl border border-black/[0.08] bg-white p-5 text-[13px] leading-relaxed text-zinc-600">
      <h2 className="label-mono text-[11px] text-zinc-500">[ Sources, checked Nov 2026 ]</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {items.map(([label, href]) => (
          <li key={href}>
            <a href={href} rel="nofollow noopener" target="_blank" className="underline decoration-black/20 underline-offset-2 hover:decoration-black">
              {label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3">Prices and features of other apps change. If something here is out of date, tell us and we fix it.</p>
    </aside>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return <div className="not-prose my-8 rounded-2xl border-l-4 border-[#c8ff3d] bg-white p-5 text-[15px] leading-relaxed shadow-[0_1px_0_rgba(0,0,0,.04)]">{children}</div>;
}

export function InlineCTA({ text = "Find my leaks" }: { text?: string }) {
  return (
    <p className="not-prose my-8">
      <a href="#scan" className="inline-flex h-12 items-center gap-3 rounded-full bg-lime pl-5 pr-1.5 font-semibold text-ink">
        {text}
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-lime">
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </a>
    </p>
  );
}
