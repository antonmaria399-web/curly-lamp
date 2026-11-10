import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { creatorCap, creatorRate, isOwner, siteUrl } from "@/lib/growth";
import { FORMATS, MESSAGES } from "@/lib/growth-content";
import { getPlans } from "@/lib/kwop";
import { Logo } from "@/components/ui/logo";
import { cn, usd } from "@/lib/cn";
import { CopyButton, CreatorRow, PayoutForm, DeletePayout } from "./client";

export const metadata: Metadata = { title: "Growth", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const TABS = [
  ["numbers", "Numbers"],
  ["creators", "Creators"],
  ["scripts", "Scripts"],
  ["messages", "Messages"],
] as const;
type Tab = (typeof TABS)[number][0];

const ago = (days: number) => Date.now() - days * 86400000;

/** Monday of the week containing d (UTC), as YYYY-MM-DD. */
function monday(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x.toISOString().slice(0, 10);
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const user = await getUser();
  if (!isOwner(user?.email)) notFound();
  const sp = await searchParams;
  const tab: Tab = (TABS.map((t) => t[0]) as string[]).includes(String(sp.tab)) ? (sp.tab as Tab) : "numbers";

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
          </Link>
          <span className="label-mono text-muted">[ Growth ]</span>
        </div>
        <nav className="mx-auto flex max-w-[960px] gap-1 overflow-x-auto px-3 pb-2">
          {TABS.map(([k, l]) => (
            <Link key={k} href={`/admin?tab=${k}`} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-medium transition", tab === k ? "bg-fg text-bg" : "text-muted hover:bg-surface-2")}>
              {l}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[960px] px-4 pb-24 pt-6">
        {tab === "numbers" && <Numbers />}
        {tab === "creators" && <Creators week={typeof sp.week === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.week) ? sp.week : monday()} />}
        {tab === "scripts" && <Scripts />}
        {tab === "messages" && <Messages />}
      </main>
    </div>
  );
}

async function Numbers() {
  const db = supabaseAdmin();
  const since30 = new Date(ago(30)).toISOString();
  const since7 = ago(7);
  const [{ data: events }, { plans }, { data: feedback }, { count: users }] = await Promise.all([
    db.from("events").select("type, detail, created_at").gte("created_at", since30).limit(50000),
    getPlans(),
    db.from("cancel_feedback").select("reason, note, cancelled, created_at").order("created_at", { ascending: false }).limit(30),
    db.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  const ev = events ?? [];
  // Revenue: each payment's plan + period comes from its checkout (same ref).
  const checkout = new Map<string, { plan: number; period: string }>();
  for (const e of ev) if (e.type === "checkout" && e.detail) {
    const [plan, period, ref] = e.detail.split(":");
    checkout.set(ref, { plan: Number(plan), period });
  }
  const amount = (detail: string | null) => {
    const [planId, ref] = (detail ?? "").split(":");
    const c = checkout.get(ref);
    const p = plans.find((x) => x.id === (c?.plan ?? Number(planId)));
    if (!p) return 0;
    return (c?.period === "year" && p.yearly ? p.yearly.price_cents : p.price_cents) / 100;
  };
  const row = (type: string) => {
    const all = ev.filter((e) => e.type === type);
    return [all.filter((e) => Date.parse(e.created_at) >= since7).length, all.length];
  };
  const paid = ev.filter((e) => e.type === "paid");
  const rev7 = paid.filter((e) => Date.parse(e.created_at) >= since7).reduce((s, e) => s + amount(e.detail), 0);
  const rev30 = paid.reduce((s, e) => s + amount(e.detail), 0);
  const rows: [string, number | string, number | string][] = [
    ["Sign-ups", ...(row("signup") as [number, number])],
    ["First leak reports (scans)", ...(row("onboarding_done") as [number, number])],
    ["Paywall views", ...(row("paywall_view") as [number, number])],
    ["Payments", ...(row("paid") as [number, number])],
    ["Revenue (new payments)", usd(rev7), usd(rev30)],
    ["Shares", ...(row("share") as [number, number])],
    ["Invites sent", ...(row("invite_sent") as [number, number])],
    ["Friends who joined", ...(row("invite_signup") as [number, number])],
    ["Yearly offer shown / taken", `${row("offer_view")[0]} / ${row("offer_paid")[0]}`, `${row("offer_view")[1]} / ${row("offer_paid")[1]}`],
    ["Creator applications", ...(row("creator_apply") as [number, number])],
    ["Cancellations", ...(row("cancelled") as [number, number])],
  ];
  const bySource = new Map<string, number>();
  for (const e of ev) if (e.type === "signup" && e.detail?.startsWith("ref:")) bySource.set(e.detail.slice(4), (bySource.get(e.detail.slice(4)) ?? 0) + 1);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Numbers</h1>
        <p className="num mt-1 text-sm text-muted">{users ?? 0} accounts in total · revenue counts new payments confirmed in the app</p>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
        <div className="grid grid-cols-[1fr_72px_72px] border-b border-line bg-surface-2 px-4 py-2.5 text-xs font-semibold text-muted">
          <span />
          <span className="text-right">7 days</span>
          <span className="text-right">30 days</span>
        </div>
        {rows.map(([l, a, b]) => (
          <div key={l} className="num grid grid-cols-[1fr_72px_72px] items-center border-b border-line px-4 py-3 text-sm last:border-0">
            <span className="font-sans">{l}</span>
            <span className="text-right font-semibold">{a}</span>
            <span className="text-right text-muted">{b}</span>
          </div>
        ))}
      </div>
      {bySource.size > 0 && (
        <section>
          <h2 className="font-semibold">Sign-ups by creator link (30 days)</h2>
          <ul className="num mt-3 space-y-1 text-sm">
            {[...bySource.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => (
              <li key={k} className="flex justify-between rounded-xl bg-surface-2 px-3 py-2">
                <span>?ref={k}</span>
                <b>{n}</b>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h2 className="font-semibold">Why people cancel</h2>
        {(feedback ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-muted">No answers yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {(feedback ?? []).map((f, i) => (
              <li key={i} className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
                <div className="flex justify-between gap-2">
                  <b>{f.reason.replace("_", " ")}</b>
                  <span className="num text-xs text-muted">
                    {new Date(f.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {f.cancelled ? " · cancelled" : ""}
                  </span>
                </div>
                {f.note && <p className="mt-1 text-muted">“{f.note}”</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

async function Creators({ week }: { week: string }) {
  const db = supabaseAdmin();
  const rate = creatorRate();
  const cap = creatorCap();
  const [{ data: apps }, { data: payouts }] = await Promise.all([
    db.from("creator_applications").select("*").order("created_at", { ascending: false }).limit(200),
    db.from("creator_payouts").select("*").eq("week", week).order("created_at"),
  ]);
  const site = siteUrl();
  const welcome = MESSAGES.find((m) => m.key === "accepted")!.text;
  const pay = (views: number) => Math.min(cap, (views * rate) / 1000);
  const total = (payouts ?? []).reduce((s, p) => s + pay(p.views), 0);
  const prev = new Date(Date.parse(week) - 7 * 86400000).toISOString().slice(0, 10);
  const next = new Date(Date.parse(week) + 7 * 86400000).toISOString().slice(0, 10);
  const active = (apps ?? []).filter((a) => a.status === "accepted" || a.status === "active");
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Creators</h1>
        <p className="num mt-1 text-sm text-muted">
          ${rate} per 1,000 views · cap ${cap} per video · change with CREATOR_RATE / CREATOR_CAP
        </p>
      </div>
      <section className="space-y-3">
        {(apps ?? []).length === 0 && <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">No applications yet. Share {site}/creators.</p>}
        {(apps ?? []).map((a) => (
          <CreatorRow
            key={a.id}
            app={{ id: a.id, name: a.name, email: a.email, handle: a.handle, platform: a.platform, avg_views: a.avg_views, country: a.country, status: a.status, ref_code: a.ref_code, created_at: a.created_at }}
            welcome={welcome
              .replaceAll("{name}", a.name.split(" ")[0])
              .replaceAll("{ref_link}", a.ref_code ? `${site}/?ref=${a.ref_code}` : "[create it in Kwop → Tracking, then paste the code above]")
              .replaceAll("{link}", site)
              .replaceAll("{rate}", String(rate))
              .replaceAll("{cap}", String(cap))}
          />
        ))}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Monday payout</h2>
          <div className="num flex items-center gap-1 text-sm">
            <Link href={`/admin?tab=creators&week=${prev}`} className="rounded-full px-3 py-1.5 hover:bg-surface-2">←</Link>
            <span>week of {week}</span>
            <Link href={`/admin?tab=creators&week=${next}`} className="rounded-full px-3 py-1.5 hover:bg-surface-2">→</Link>
          </div>
        </div>
        <div className="mt-3 overflow-hidden rounded-[20px] border border-line bg-surface">
          {(payouts ?? []).length === 0 && <p className="p-5 text-sm text-muted">No videos typed for this week yet.</p>}
          {(payouts ?? []).map((p) => {
            const a = (apps ?? []).find((x) => x.id === p.application_id);
            return (
              <div key={p.id} className="num grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-line px-4 py-3 text-sm last:border-0">
                <span className="min-w-0 truncate font-sans">
                  {a?.handle ?? "?"} {p.video_url && <a href={p.video_url} target="_blank" rel="noreferrer" className="text-muted underline">video</a>}
                </span>
                <span className="text-muted">{p.views.toLocaleString("en-US")} views</span>
                <b>{usd(pay(p.views))}</b>
                <DeletePayout id={p.id} />
              </div>
            );
          })}
          <div className="num flex justify-between bg-surface-2 px-4 py-3 text-sm font-semibold">
            <span>Total to pay</span>
            <span>{usd(total)}</span>
          </div>
        </div>
        {active.length > 0 ? (
          <PayoutForm week={week} creators={active.map((a) => ({ id: a.id, handle: a.handle }))} rate={rate} cap={cap} />
        ) : (
          <p className="mt-3 text-sm text-muted">Accept a creator to type their views here.</p>
        )}
      </section>
    </div>
  );
}

function Scripts() {
  return (
    <div className="space-y-8">
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Scripts</h1>
      {FORMATS.map((f) => {
        const script = `${f.name}\n\n${f.beats.map((b) => `${b.t} · ${b.show}\nOn screen: ${b.text}`).join("\n\n")}\n\nComment keyword: ${f.keyword}`;
        return (
          <section key={f.key} className="rounded-[20px] border border-line bg-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{f.name}</h2>
                <p className="mt-1 text-sm text-muted">{f.why}</p>
              </div>
              <CopyButton text={script} label="Copy script" />
            </div>
            <ol className="mt-4 space-y-2 text-sm">
              {f.beats.map((b) => (
                <li key={b.t} className="grid grid-cols-[64px_1fr] gap-2">
                  <span className="num text-muted">{b.t}</span>
                  <span>
                    {b.show} <span className="text-muted">· “{b.text}”</span>
                  </span>
                </li>
              ))}
            </ol>
            <h3 className="mt-5 text-sm font-semibold">10 hooks · comment keyword {f.keyword}</h3>
            <ul className="mt-2 space-y-1.5">
              {f.hooks.map((h) => (
                <li key={h} className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2 text-sm">
                  <span>{h}</span>
                  <CopyButton text={h} small />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Messages() {
  const site = siteUrl();
  const fill = (t: string) => t.replaceAll("{link}", site).replaceAll("{rate}", String(creatorRate())).replaceAll("{cap}", String(creatorCap()));
  return (
    <div className="space-y-5">
      <h1 className="text-[28px] font-semibold tracking-[-0.03em]">Messages</h1>
      {MESSAGES.map((m) => (
        <section key={m.key} className="rounded-[20px] border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">{m.title}</h2>
            <CopyButton text={fill(m.text)} />
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-muted">{fill(m.text)}</p>
        </section>
      ))}
    </div>
  );
}
