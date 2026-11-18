import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { CREATOR_CAP, CREATOR_RATE, isOwner } from "@/lib/growth";
import { FORMATS, MESSAGES } from "@/lib/growth-content";
import { SITE_URL } from "@/lib/seo";
import { Logo } from "@/components/ui/logo";
import { CopyButton, CreatorRow, PayoutTable } from "@/components/growth/admin-bits";
import { cn, usd } from "@/lib/cn";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Growth", robots: { index: false, follow: false } };

const TABS = [
  ["numbers", "Numbers"],
  ["creators", "Creators"],
  ["scripts", "Scripts"],
  ["messages", "Messages"],
  ["feedback", "Feedback"],
] as const;

const D = 86400000;

// Test accounts made by the e2e run (@budgeto-test.dev) are left out of the owner's numbers.
const TEST = "%@budgeto-test.dev";
type Filter = { col: string; op: "eq" | "neq" | "notlike"; val: string } | null;

async function numbers() {
  const db = supabaseAdmin();
  const since = (days: number) => new Date(Date.now() - days * D).toISOString();
  const count = async (table: string, days: number, f: Filter) => {
    let q = db.from(table).select("id", { count: "exact", head: true }).gte("created_at", since(days));
    if (f) q = f.op === "eq" ? q.eq(f.col, f.val) : f.op === "neq" ? q.neq(f.col, f.val) : q.not(f.col, "like", f.val);
    const { count: c } = await q;
    return c ?? 0;
  };
  const ev = (type: string): Filter => ({ col: "type", op: "eq", val: type });
  const SAMPLE = "Sample statement.pdf";
  const defs: [string, string, Filter][] = [
    ["Sign-ups", "profiles", { col: "email", op: "notlike", val: TEST }],
    ["Leak reports made", "reports", { col: "file_name", op: "neq", val: SAMPLE }],
    ["Sample scans", "reports", { col: "file_name", op: "eq", val: SAMPLE }],
    ["Paywall views", "events", ev("paywall_view")],
    ["Payments", "events", ev("payment")],
    ["Yearly offers shown", "events", ev("offer_view")],
    ["Offers paid", "events", ev("offer_paid")],
    ["Shares", "events", ev("share")],
    ["Invite sign-ups", "events", ev("invite_signup")],
    ["Cancellations", "events", ev("cancel")],
    ["Creator applications", "creator_applications", { col: "email", op: "notlike", val: TEST }],
  ];
  const rows = await Promise.all(defs.map(async ([label, table, f]) => [label, [await count(table, 7, f), await count(table, 30, f)]] as const));
  const out: Record<string, [number, number]> = Object.fromEntries(rows.map(([l, v]) => [l, [v[0], v[1]]]));
  const rev = async (days: number) => {
    const { data } = await db.from("events").select("amount_cents").eq("type", "payment").gte("created_at", since(days));
    return (data ?? []).reduce((a, r) => a + (r.amount_cents ?? 0), 0) / 100;
  };
  const [r7, r30] = await Promise.all([rev(7), rev(30)]);
  return { out, r7, r30 };
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const user = await getUser();
  if (!isOwner(user?.email)) notFound();
  const sp = await searchParams;
  const tab = (TABS.find(([k]) => k === sp.tab)?.[0] ?? "numbers") as (typeof TABS)[number][0];
  const db = supabaseAdmin();
  const rate = CREATOR_RATE();
  const cap = CREATOR_CAP();

  return (
    <main className="min-h-dvh bg-bg pb-24">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-[980px] items-center justify-between px-4 py-3">
          <Link href="/dashboard">
            <Logo />
          </Link>
          <span className="label-mono text-muted">[ Growth ]</span>
        </div>
        <nav className="mx-auto flex max-w-[980px] gap-1 overflow-x-auto px-3 pb-2">
          {TABS.map(([k, l]) => (
            <Link
              key={k}
              href={`/admin?tab=${k}`}
              className={cn("whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition", tab === k ? "bg-fg text-bg" : "text-muted hover:bg-surface-2")}
            >
              {l}
            </Link>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-[980px] px-4 pt-6">
        {tab === "numbers" && <NumbersTab />}
        {tab === "creators" && <CreatorsTab rate={rate} cap={cap} />}
        {tab === "scripts" && (
          <div className="space-y-6">
            <p className="text-sm text-muted">The 3 formats from GROWTH.md. Post on 2 accounts, 1 to 3 videos a day. Under 200 views after 2 h: new hook. Over 1,000: 2 more versions.</p>
            {FORMATS.map((f) => (
              <section key={f.id} className="rounded-[20px] border border-line bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{f.name}</h2>
                    <p className="mt-1 text-sm text-muted">{f.why}</p>
                  </div>
                  <span className="num shrink-0 rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-ink">{f.keyword}</span>
                </div>
                <ol className="mt-4 space-y-1.5 text-sm">
                  {f.beats.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ol>
                <CopyButton className="mt-3" label="Copy the script" text={`${f.name}\n\n${f.beats.join("\n")}\n\nOn screen: ${f.onScreen.join(" / ")}\nComment keyword: ${f.keyword}`} />
                <h3 className="label-mono mt-5 text-muted">[ 10 hooks ]</h3>
                <ul className="mt-2 divide-y divide-line">
                  {f.hooks.map((h) => (
                    <li key={h} className="flex items-center justify-between gap-3 py-2 text-[15px]">
                      {h}
                      <CopyButton text={h} small />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
        {tab === "messages" && (
          <div className="space-y-4">
            {MESSAGES({ rate, cap, site: SITE_URL }).map((m) => (
              <section key={m.id} className="rounded-[20px] border border-line bg-surface p-5">
                <h2 className="font-semibold">{m.title}</h2>
                <p className="mt-2 whitespace-pre-line text-[15px] text-muted">{m.text}</p>
                <CopyButton className="mt-3" text={m.text} />
              </section>
            ))}
          </div>
        )}
        {tab === "feedback" && <FeedbackTab />}
      </div>
    </main>
  );

  async function NumbersTab() {
    const { out, r7, r30 } = await numbers();
    return (
      <div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Revenue · 7 days" value={usd(r7)} big />
          <Stat label="Revenue · 30 days" value={usd(r30)} big />
          <Stat label="Payments · 7 days" value={String(out["Payments"][0])} big />
          <Stat label="Sign-ups · 7 days" value={String(out["Sign-ups"][0])} big />
        </div>
        <div className="mt-5 overflow-hidden rounded-[20px] border border-line bg-surface">
          <div className="grid grid-cols-[1fr_72px_72px] border-b border-line bg-surface-2 px-4 py-2.5 text-xs font-semibold text-muted">
            <span />
            <span className="text-right">7 days</span>
            <span className="text-right">30 days</span>
          </div>
          {Object.entries(out).map(([k, [a, b]]) => (
            <div key={k} className="num grid grid-cols-[1fr_72px_72px] border-b border-line px-4 py-3 text-[15px] last:border-0">
              <span className="font-sans">{k}</span>
              <span className="text-right">{a}</span>
              <span className="text-right">{b}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">Counted from Budgeto&apos;s own database since the growth build (Nov 18, 2026). Revenue = plan price of each confirmed payment; Kwop&apos;s dashboard has the exact payouts and refunds.</p>
      </div>
    );
  }

  async function CreatorsTab({ rate, cap }: { rate: number; cap: number }) {
    const [{ data: apps }, { data: profs }, { data: pays }] = await Promise.all([
      db.from("creator_applications").select("*").not("email", "like", TEST).order("created_at", { ascending: false }).limit(200),
      db.from("profiles").select("id, source").not("source", "is", null).limit(5000),
      db.from("events").select("user_id").eq("type", "payment").limit(5000),
    ]);
    const paid = new Set((pays ?? []).map((p) => p.user_id));
    const byRef = new Map<string, { signups: number; payers: number }>();
    for (const p of profs ?? []) {
      const ref = (p.source as { ref?: string } | null)?.ref;
      if (!ref) continue;
      const e = byRef.get(ref.toLowerCase()) ?? { signups: 0, payers: 0 };
      e.signups++;
      if (paid.has(p.id)) e.payers++;
      byRef.set(ref.toLowerCase(), e);
    }
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted">
          Create each creator&apos;s link in Kwop → Tracking: it opens Budgeto with <span className="num">?ref=&lt;code&gt;</span>. Type that code on their row: sign-ups and payments are credited below. Pay: ${rate} / 1,000 views, max ${cap} per video.
        </p>
        {(apps ?? []).length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-line p-8 text-center text-sm text-muted">
            No applications yet. Share <span className="num text-fg">{SITE_URL}/creators</span> with the side-income post (Messages tab).
          </div>
        ) : (
          <ul className="space-y-3">
            {(apps ?? []).map((a) => (
              <CreatorRow key={a.id} app={a} stats={a.code ? byRef.get(String(a.code).toLowerCase()) ?? { signups: 0, payers: 0 } : null} rate={rate} cap={cap} site={SITE_URL} />
            ))}
          </ul>
        )}
        <section>
          <h2 className="text-lg font-semibold">Monday payout</h2>
          <p className="mt-1 text-sm text-muted">Type each video&apos;s views: views × ${rate} ÷ 1,000, capped at ${cap} per video.</p>
          <PayoutTable rate={rate} cap={cap} creators={(apps ?? []).filter((a) => a.status === "active" || a.status === "accepted").map((a) => a.name as string)} />
        </section>
      </div>
    );
  }

  async function FeedbackTab() {
    const { data } = await db.from("cancel_feedback").select("reason, detail, created_at").order("created_at", { ascending: false }).limit(200);
    const labels: Record<string, string> = { too_expensive: "Too expensive", not_using: "Not using it", missing: "Something's missing", other: "Other" };
    const counts = Object.keys(labels).map((k) => [labels[k], (data ?? []).filter((d) => d.reason === k).length] as const);
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {counts.map(([l, n]) => (
            <Stat key={l} label={l} value={String(n)} />
          ))}
        </div>
        {(data ?? []).length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-line p-8 text-center text-sm text-muted">No cancellations with a reason yet.</div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface">
            {(data ?? []).map((d, i) => (
              <li key={i} className="px-4 py-3 text-[15px]">
                <div className="flex justify-between gap-3">
                  <span className="font-medium">{labels[d.reason]}</span>
                  <span className="num text-xs text-muted">{new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                {d.detail && <p className="mt-1 text-muted">“{d.detail}”</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

function Stat({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="rounded-[18px] border border-line bg-surface p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className={cn("num mt-1 font-semibold tracking-tight", big ? "text-[26px]" : "text-xl")}>{value}</div>
    </div>
  );
}
