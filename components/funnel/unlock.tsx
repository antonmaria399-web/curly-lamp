"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Check, ChevronDown, CreditCard, FileSearch, Loader2, Lock, PiggyBank, ShieldCheck, Sparkles, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sheet, useMounted } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { AuthForm } from "./auth-form";
import { LogoMark } from "@/components/ui/logo";
import { REFUND_DAYS, STATEMENT_NAME, SUPPORT_EMAIL } from "@/lib/brand";

export type UIPlan = {
  id: number;
  name: string;
  price_cents: number;
  per_day: string;
  yearly: { price_cents: number; per_day: string } | null;
  tier: 1 | 2 | 3;
  tag: string;
  unlocks: string[];
  scans: number;
  featured: boolean;
};

type Ctx = {
  /** "See my full leak report": sign-up first if needed, then the paywall. */
  unlock: () => void;
  openPaywall: () => void;
  openUpgrade: (toTier?: 2 | 3) => void;
  authed: boolean;
  paid: boolean;
  plans: UIPlan[];
  minPerDay: string | null;
};

const UnlockCtx = createContext<Ctx | null>(null);
export const useUnlock = () => {
  const c = useContext(UnlockCtx);
  if (!c) throw new Error("useUnlock outside UnlockProvider");
  return c;
};

const short = (n: string) => n.replace(/^Budgeto\s+/i, "");
const money = (cents: number) => "$" + (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
const money2 = (cents: number) => "$" + (cents / 100).toFixed(2);

function event(type: string, detail?: string) {
  fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, detail }), keepalive: true }).catch(() => {});
}

export function UnlockProvider({
  children,
  authed: initialAuthed,
  paid: initialPaid,
  currentTier = 0,
  personal,
  onUnlocked,
  onAuthed,
}: {
  children: React.ReactNode;
  authed: boolean;
  paid: boolean;
  currentTier?: number;
  /** One short personal line under the paywall title. */
  personal?: string;
  onUnlocked?: (planName: string) => void | Promise<void>;
  onAuthed?: () => void;
}) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [paid, setPaid] = useState(initialPaid);
  const [plans, setPlans] = useState<UIPlan[]>([]);
  const [view, setView] = useState<null | "auth" | "paywall" | "upgrade">(null);
  const [upgradeTier, setUpgradeTier] = useState<2 | 3>(2);
  const [checkout, setCheckout] = useState<{ plan: UIPlan; period: "month" | "year" } | null>(null);
  const [film, setFilm] = useState<string | null>(null);

  useEffect(() => setAuthed(initialAuthed), [initialAuthed]);
  useEffect(() => setPaid(initialPaid), [initialPaid]);

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((j) => setPlans(j.plans ?? []))
      .catch(() => {});
  }, []);

  const openPaywall = useCallback(() => {
    setView("paywall");
    event("paywall_view");
  }, []);
  const unlock = useCallback(() => {
    if (!authed) setView("auth");
    else openPaywall();
  }, [authed, openPaywall]);
  const openUpgrade = useCallback(
    (to?: 2 | 3) => {
      if (!paid) return openPaywall();
      setUpgradeTier(to ?? (currentTier >= 2 ? 3 : 2));
      setView("upgrade");
      event("paywall_view", "upgrade");
    },
    [paid, currentTier, openPaywall],
  );

  // A buyer coming back from the fallback checkout page: /dashboard?paid=1&ref=…
  const confirmRef = useRef<(ref: string) => void>(() => {});
  useEffect(() => {
    const u = new URL(window.location.href);
    const ref = u.searchParams.get("ref");
    if (u.searchParams.get("paid") === "1" && ref) {
      u.searchParams.delete("paid");
      u.searchParams.delete("ref");
      window.history.replaceState(null, "", u.pathname + u.search);
      confirmRef.current(ref);
    }
  }, []);

  const finish = useCallback(
    async (ref: string) => {
      const r = await fetch("/api/checkout/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref }) })
        .then((x) => x.json())
        .catch(() => null);
      setCheckout(null);
      setView(null);
      if (r?.paid) {
        setPaid(true);
        setFilm(short(r.plan?.name ?? "your plan"));
      } else {
        // Payment may still be settling: try again once in a few seconds.
        setTimeout(async () => {
          const r2 = await fetch("/api/checkout/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref }) })
            .then((x) => x.json())
            .catch(() => null);
          if (r2?.paid) {
            setPaid(true);
            setFilm(short(r2.plan?.name ?? "your plan"));
          }
        }, 4000);
      }
    },
    [],
  );
  useEffect(() => {
    confirmRef.current = finish;
  }, [finish]);

  const minPerDay = plans[0]?.per_day ?? null;
  const value = useMemo(() => ({ unlock, openPaywall, openUpgrade, authed, paid, plans, minPerDay }), [unlock, openPaywall, openUpgrade, authed, paid, plans, minPerDay]);

  return (
    <UnlockCtx.Provider value={value}>
      {children}

      <Sheet open={view === "auth"} onClose={() => setView(null)} label="Save your leak report" width={440}>
        <div className="overflow-y-auto px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-12 md:px-8 md:pb-8">
          <div className="mb-6 text-center">
            <LogoMark className="mx-auto h-10 w-10" />
            <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.03em]">Save your leak report</h2>
            <p className="mt-1.5 text-[15px] text-muted">One tap, and it waits for you in your account.</p>
          </div>
          <AuthForm
            inSheet
            onDone={() => {
              setAuthed(true);
              onAuthed?.();
              setView("paywall");
              event("paywall_view");
            }}
          />
        </div>
      </Sheet>

      <Sheet open={view === "paywall"} onClose={() => setView(null)} label="Choose your plan" mode="full" width={480}>
        <Paywall plans={plans} personal={personal} onContinue={(plan, period) => setCheckout({ plan, period })} />
      </Sheet>

      <Sheet open={view === "upgrade"} onClose={() => setView(null)} label="Upgrade" width={440}>
        <UpgradeSheet plan={plans.find((p) => p.tier === upgradeTier) ?? null} onContinue={(plan) => setCheckout({ plan, period: "month" })} />
      </Sheet>

      <CheckoutSheet sel={checkout} onClose={() => setCheckout(null)} onPaid={finish} />

      <UnlockFilm plan={film} onDone={async () => {
        const p = film;
        setFilm(null);
        await onUnlocked?.(p ?? "");
      }} />
    </UnlockCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */

const FAQ = [
  {
    q: "Will it work with my bank?",
    a: "Yes, if your bank lets you download a PDF statement (Chase, Bank of America, Wells Fargo, Capital One, credit unions and cards all do). You already saw it work on yours.",
  },
  {
    q: "Can I cancel anytime?",
    a: `Yes. Account → Billing → Cancel my subscription. Two taps, no call. You're never charged again after that. And if Budgeto isn't for you, email ${SUPPORT_EMAIL} within ${REFUND_DAYS} days of paying for a full refund.`,
  },
  { q: "What happens right after I pay?", a: "Your full leak report unlocks right here, in seconds. No email to check, no reload." },
];

function PlanRows({ plans, period, sel, setSel }: { plans: UIPlan[]; period: "month" | "year"; sel: number | null; setSel: (id: number) => void }) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Plans">
      {plans.map((p) => {
        const y = period === "year" && p.yearly;
        const active = sel === p.id;
        return (
          <button
            key={p.id}
            role="radio"
            aria-checked={active}
            onClick={() => setSel(p.id)}
            className={cn(
              "relative flex w-full items-center gap-3 rounded-[18px] border-2 bg-surface px-4 py-4 text-left transition active:scale-[0.99]",
              active ? "border-fg shadow-[0_8px_30px_-12px_rgba(0,0,0,.35)]" : "border-line hover:border-fg/25",
            )}
          >
            {p.featured && (
              <span className="absolute -top-2.5 left-4 rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-semibold text-ink">Most popular</span>
            )}
            <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border-2", active ? "border-fg" : "border-fg/25")}>
              {active && <span className="h-2.5 w-2.5 rounded-full bg-fg" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{short(p.name)}</span>
              <span className="num block text-xs text-muted">
                {y ? `${money2(p.yearly!.price_cents)} / year` : `${money2(p.price_cents)} / month`}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted">{p.tag}</span>
            </span>
            <span className="text-right">
              <span className="num block text-[26px] font-semibold leading-none tracking-tight">{y ? p.yearly!.per_day : p.per_day}</span>
              <span className="text-xs text-muted">/ day</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Paywall({
  plans,
  personal,
  onContinue,
  page,
}: {
  plans: UIPlan[];
  personal?: string;
  onContinue: (p: UIPlan, period: "month" | "year") => void;
  page?: boolean;
}) {
  const [period, setPeriod] = useState<"month" | "year">("month");
  const [sel, setSel] = useState<number | null>(null);
  const [openQ, setOpenQ] = useState<number | null>(null);
  const mainBtn = useRef<HTMLButtonElement>(null);
  const [btnVisible, setBtnVisible] = useState(true);
  const selected = plans.find((p) => p.id === sel) ?? plans.find((p) => p.featured) ?? plans[0];
  const hasYearly = plans.some((p) => p.yearly);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mainBtn.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setBtnVisible(e.isIntersecting), { root: page ? null : scroller.current, threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [page, plans.length]);

  if (plans.length === 0)
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="skeleton h-6 w-56" />
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-20 w-full" />
        <div className="skeleton h-20 w-full" />
      </div>
    );

  const y = period === "year" && selected.yearly;
  const due = y ? money2(selected.yearly!.price_cents) : money2(selected.price_cents);
  const cta = (
    <button
      ref={mainBtn}
      onClick={() => onContinue(selected, y ? "year" : "month")}
      className="btn-main flex h-15 w-full items-center justify-center rounded-full bg-lime text-[17px] font-semibold text-ink"
    >
      Continue with {short(selected.name)}
    </button>
  );

  return (
    <div ref={scroller} className={cn("relative", page ? "" : "overflow-y-auto")}>
      <div className="px-5 pb-32 pt-16 md:px-8 md:pt-14">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-lime text-ink">
            <FileSearch className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-[28px] font-semibold leading-tight tracking-[-0.03em]">Your leak report is ready.</h2>
          {personal && <p className="mx-auto mt-2 max-w-sm text-[15px] text-muted">{personal}</p>}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Choose your plan.</h3>
          {hasYearly && (
            <div className="flex rounded-full bg-surface-2 p-1 text-[13px] font-medium">
              {(["month", "year"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn("rounded-full px-3 py-1.5 transition", period === p ? "bg-surface text-fg shadow-sm" : "text-muted")}
                >
                  {p === "month" ? "Monthly" : "Yearly −20%"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5">
          <PlanRows plans={plans} period={period} sel={selected.id} setSel={setSel} />
        </div>

        <div className="mt-6">
          {cta}
          <p className="num mt-2.5 text-center text-xs text-muted">
            {due} due today, then every {y ? "year" : "month"} · Cancel anytime
          </p>
        </div>

        <div className="mt-5 flex gap-3 rounded-[18px] border border-gain/25 bg-gain/[0.06] p-4">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gain" />
          <div className="text-sm">
            <p className="font-semibold">{REFUND_DAYS}-day money-back guarantee</p>
            <p className="mt-1 text-muted">
              Not happy? Email <span className="font-medium text-fg">{SUPPORT_EMAIL}</span> within {REFUND_DAYS} days of paying and get a full refund. No questions asked.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
          <ShieldCheck className="h-4 w-4" /> Secure payment, processed by Whop
          <span className="rounded-md border border-line px-1.5 py-0.5 font-medium">Whop</span>
          <span className="inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 font-medium">
            <CreditCard className="h-3 w-3" /> Card
          </span>
        </div>
        <p className="num mt-2 text-center text-[11px] text-muted">Shows on your statement as {STATEMENT_NAME}</p>

        <div className="mt-8 rounded-[18px] border border-line bg-surface-2/60 p-5">
          <h4 className="font-semibold">What you unlock with {short(selected.name)}</h4>
          <ul className="mt-3 space-y-2.5">
            {selected.unlocks.map((u) => (
              <li key={u} className="flex gap-2.5 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gain" strokeWidth={3} />
                {u}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 divide-y divide-line border-y border-line">
          {FAQ.map((f, i) => (
            <div key={f.q}>
              <button className="flex w-full items-center justify-between py-4 text-left font-medium" onClick={() => setOpenQ(openQ === i ? null : i)} aria-expanded={openQ === i}>
                {f.q}
                <ChevronDown className={cn("h-4 w-4 transition", openQ === i && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {openQ === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-4 text-sm text-muted">
                    {f.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-center text-lg font-semibold">Pick up where you left off</h3>
          <div className="mt-4">
            <PlanRows plans={plans} period={period} sel={selected.id} setSel={setSel} />
          </div>
          <button
            onClick={() => onContinue(selected, y ? "year" : "month")}
            className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-fg text-[16px] font-semibold text-bg active:scale-[0.98]"
          >
            Continue with {short(selected.name)}
          </button>
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted">
          Renews automatically until canceled. Prices in USD. Payments are processed by Whop for Budgeto.
        </p>
      </div>

      <AnimatePresence>
        {!btnVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className={cn("z-10 border-t border-line bg-surface/90 px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 backdrop-blur", page ? "fixed inset-x-0 bottom-0" : "sticky bottom-0")}
          >
            <button
              onClick={() => onContinue(selected, y ? "year" : "month")}
              className="mx-auto flex h-14 w-full max-w-md items-center justify-center rounded-full bg-lime text-[16px] font-semibold text-ink active:scale-[0.98]"
            >
              Continue with {short(selected.name)} · {y ? selected.yearly!.per_day : selected.per_day}/day
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UpgradeSheet({ plan, onContinue }: { plan: UIPlan | null; onContinue: (p: UIPlan) => void }) {
  if (!plan) return <div className="p-10 text-center text-muted">You&apos;re already on the biggest plan.</div>;
  const adds = plan.tier === 3 ? ["100 scans a month", "Compare months and banks side by side", "Custom savings rules"] : ["30 scans a month instead of 10", "Hidden Fee Hunter finds bank fees too", "Faceless Export for your videos"];
  return (
    <div className="px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-12 md:px-8 md:pb-8">
      <div className="label-mono text-muted">[ Next plan ]</div>
      <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.03em]">Go {short(plan.name)}</h2>
      <ul className="mt-5 space-y-3">
        {adds.map((a) => (
          <li key={a} className="flex gap-2.5">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gain" /> {a}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-baseline gap-2">
        <span className="num text-4xl font-semibold tracking-tight">{plan.per_day}</span>
        <span className="text-muted">/ day</span>
        <span className="num ml-auto text-sm text-muted">{money(plan.price_cents)}/month</span>
      </div>
      <button onClick={() => onContinue(plan)} className="btn-main mt-6 flex h-15 w-full items-center justify-center rounded-full bg-lime text-[17px] font-semibold text-ink">
        Upgrade to {short(plan.name)}
      </button>
      <p className="mt-3 text-center text-xs text-muted">Your current plan is replaced by the new one. Never billed twice.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    WhopElements?: () => {
      checkout: {
        create: (o: Record<string, unknown>) => { create: (k: string, props?: Record<string, unknown>) => { mount: (sel: string) => void }; destroy: () => void };
      };
    };
  }
}

let whopScript: Promise<void> | null = null;
function loadWhop() {
  if (window.WhopElements) return Promise.resolve();
  if (!whopScript)
    whopScript = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.whop.com/elements/amber/elements.js";
      s.setAttribute("data-whop-elements", "");
      s.async = true;
      s.onload = () => res();
      s.onerror = () => {
        whopScript = null;
        rej(new Error("whop script"));
      };
      document.head.appendChild(s);
    });
  return whopScript;
}

/** The checkout, inside the page: Whop's embedded checkout in a sheet over the paywall. */
function CheckoutSheet({ sel, onClose, onPaid }: { sel: { plan: UIPlan; period: "month" | "year" } | null; onClose: () => void; onPaid: (ref: string) => void }) {
  const [state, setState] = useState<"loading" | "ready" | "off" | "error">("loading");
  const ckRef = useRef<{ destroy: () => void } | null>(null);
  const shown = useRef(false);

  useEffect(() => {
    if (!sel) return;
    let alive = true;
    shown.current = false;
    setState("loading");
    const timers: number[] = [];
    const show = () => {
      if (!alive) return;
      shown.current = true;
      setState("ready");
    };
    (async () => {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: sel.plan.id, period: sel.period }),
      }).catch(() => null);
      if (!alive) return;
      if (!r) return setState("error");
      if (r.status === 409) return setState("off");
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return setState("error");
      if (!j.embed) {
        if (j.fallback_url) window.location.assign(j.fallback_url);
        else setState("error");
        return;
      }
      try {
        await loadWhop();
      } catch {
        if (j.fallback_url) return window.location.assign(j.fallback_url);
        return setState("error");
      }
      if (!alive || !window.WhopElements) return;
      const dark = document.documentElement.classList.contains("dark");
      const ck = window.WhopElements().checkout.create({
        checkoutConfiguration: j.embed,
        returnUrl: location.origin + "/dashboard?paid=1&ref=" + j.ref,
        appearance: { theme: { appearance: dark ? "dark" : "light" } },
        onLoadingChange: (st: unknown) => {
          if ((st && typeof st === "object" ? (st as { loading: boolean }).loading : st) === false) show();
        },
        onComplete: (res: { result?: string }) => {
          if (res && res.result === "payment") onPaid(j.ref);
        },
      });
      ckRef.current = ck;
      ck.create("checkout", j.email ? { buyerEmail: j.email, lockBuyerEmail: true } : undefined).mount("#whop-checkout");
      timers.push(
        window.setTimeout(() => {
          if (!shown.current && document.querySelector("#whop-checkout iframe")) show();
        }, 2000),
      );
      timers.push(
        window.setTimeout(() => {
          if (!shown.current && j.fallback_url) window.location.assign(j.fallback_url);
        }, 15000),
      );
    })();
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      try {
        ckRef.current?.destroy();
      } catch {}
      ckRef.current = null;
    };
  }, [sel, onPaid]);

  const p = sel?.plan;
  const price = p ? (sel!.period === "year" && p.yearly ? `${money2(p.yearly.price_cents)} / year` : `${money2(p.price_cents)} / month`) : "";
  return (
    <Sheet open={Boolean(sel)} onClose={onClose} label="Checkout" width={520} z={70} closeSide="right">
      <div className="flex max-h-[90dvh] flex-col overflow-y-auto px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 md:px-7 md:pt-6">
        <div className="pr-12">
          <div className="label-mono text-muted">[ Checkout ]</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Budgeto {p ? short(p.name) : ""} <span className="num font-normal text-muted">· {price}</span>
          </h2>
        </div>
        {state === "off" ? (
          <div className="my-10 text-center">
            <PiggyBank className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-3 font-medium">Payments open in a moment. Your leak report is saved.</p>
            <button onClick={onClose} className="mt-5 h-11 rounded-full border border-line px-5 text-sm font-medium">
              Back
            </button>
          </div>
        ) : state === "error" ? (
          <div className="my-10 text-center">
            <p className="font-medium">Checkout didn&apos;t load. Check your connection and try again.</p>
            <button onClick={onClose} className="mt-5 h-11 rounded-full border border-line px-5 text-sm font-medium">
              Back
            </button>
          </div>
        ) : (
          <div className="relative mt-4 min-h-[420px]">
            {state === "loading" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading secure checkout…
              </div>
            )}
            <div id="whop-checkout" className={cn("transition-opacity", state === "ready" ? "opacity-100" : "opacity-0")} />
          </div>
        )}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Lock className="h-3 w-3" /> Secure payment by Whop · {REFUND_DAYS}-day money-back guarantee
        </p>
      </div>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */

/** The unlock film: 3 short scenes in ~5 s, skippable. */
function UnlockFilm({ plan, onDone }: { plan: string | null; onDone: () => void }) {
  const [scene, setScene] = useState(0);
  const mounted = useMounted();
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!plan) return;
    setScene(0);
    const t1 = setTimeout(() => setScene(1), 1600);
    const t2 = setTimeout(() => setScene(2), 3500);
    const t3 = setTimeout(onDone, 5000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [plan, onDone]);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {plan && (
        <motion.div
          className="dark fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-night text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-label="Unlocked"
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="top-glow pointer-events-none absolute inset-0" />
          <button onClick={onDone} aria-label="Skip" className="absolute right-4 top-[max(16px,env(safe-area-inset-top))] grid h-10 w-10 place-items-center rounded-full bg-white/10">
            <X className="h-5 w-5" />
          </button>
          <AnimatePresence mode="wait">
            {scene === 0 && (
              <motion.div key="s0" className="px-8 text-center" initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ type: "spring", damping: 18 }}>
                <motion.span
                  className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-lime text-ink"
                  initial={{ scale: reduce ? 1 : 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
                >
                  <BadgeCheck className="h-10 w-10" />
                </motion.span>
                <h2 className="title-xl mt-6 text-[40px] sm:text-[56px]">You&apos;re on {plan}</h2>
              </motion.div>
            )}
            {scene === 1 && (
              <motion.div key="s1" className="grid grid-cols-3 gap-4 px-6 text-center sm:gap-10" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                {[
                  [FileSearch, "Every leak"],
                  [ShieldCheck, "Cancel steps"],
                  [PiggyBank, "Savings tracker"],
                ].map(([Icon, t], i) => {
                  const I = Icon as typeof FileSearch;
                  return (
                    <motion.div key={t as string} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
                      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/5">
                        <I className="h-7 w-7 text-lime" />
                      </span>
                      <p className="mt-3 text-sm font-medium sm:text-base">{t as string}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
            {scene === 2 && (
              <motion.h2 key="s2" className="title-xl text-[48px] sm:text-[72px]" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                Let&apos;s go<span className="text-lime">.</span>
              </motion.h2>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
