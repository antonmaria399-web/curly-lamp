"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Gift, Share2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Invite = { code: string; link: string; friends: number; earned: number; left: number; reward: { signup: number; welcome: number; paid: number } };

function ping(type: string, detail?: string) {
  fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, detail }), keepalive: true }).catch(() => {});
}

let cache: Promise<Invite | null> | null = null;
export function useInvite() {
  const [inv, setInv] = useState<Invite | null>(null);
  useEffect(() => {
    if (!cache) cache = fetch("/api/invite").then((r) => (r.ok ? r.json() : null)).catch(() => null);
    let alive = true;
    cache.then((v) => alive && setInv(v));
    return () => {
      alive = false;
    };
  }, []);
  return inv;
}

async function shareOrCopy(data: { title: string; text: string; url: string }) {
  try {
    if (navigator.share) {
      await navigator.share(data);
      return "shared" as const;
    }
  } catch {
    return "cancelled" as const;
  }
  await navigator.clipboard?.writeText(data.url).catch(() => {});
  return "copied" as const;
}

/** Share a full result: the branded image page /s/<id>, carrying the user's invite code. */
export function ShareButton({ id, shared: initial, className }: { id: string; shared: boolean; className?: string }) {
  const inv = useInvite();
  const [shared, setShared] = useState(initial);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const share = async () => {
    setBusy(true);
    if (!shared) {
      const r = await fetch(`/api/reports/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shared: true }) });
      if (!r.ok) return setBusy(false);
      setShared(true);
    }
    setBusy(false);
    const url = `${location.origin}/s/${id}${inv ? `?i=${inv.code}` : ""}`;
    const res = await shareOrCopy({ title: "My Budgeto leak report", text: "I found the subscriptions I forgot I was paying for. Try it on your statement:", url });
    if (res !== "cancelled") ping("share", "report");
    if (res === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <Button variant="outline" onClick={share} loading={busy} className={className}>
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} {copied ? "Link copied" : "Share"}
    </Button>
  );
}

/** Invite friends: both get extra scans when the friend signs up, the inviter gets more when the friend pays. */
export function InviteCard({ compact, className }: { compact?: boolean; className?: string }) {
  const inv = useInvite();
  const [copied, setCopied] = useState(false);
  if (!inv) return <div className={cn("skeleton h-[132px] w-full rounded-[20px]", className)} />;
  const send = async () => {
    const res = await shareOrCopy({
      title: "Budgeto",
      text: `I use Budgeto to find forgotten subscriptions from my bank statement PDF. We both get ${inv.reward.signup} extra scans if you sign up with my link:`,
      url: inv.link,
    });
    if (res !== "cancelled") ping("invite_sent", res);
    if (res === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className={cn("rounded-[20px] border border-line bg-surface p-5", className)}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-ink">
          <Gift className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Invite a friend, you both get {inv.reward.signup} extra scans</p>
          <p className="mt-0.5 text-sm text-muted">
            When a friend signs up with your link. If they pick a plan, you get {inv.reward.paid} more.
          </p>
        </div>
      </div>
      {!compact && (
        <div className="num mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            [inv.friends, "friends joined"],
            [inv.earned, "scans earned"],
            [inv.left, "scans left"],
          ].map(([v, l]) => (
            <div key={l as string} className="rounded-xl bg-surface-2 px-2 py-2.5">
              <div className="text-xl font-semibold">{v as number}</div>
              <div className="text-[11px] text-muted">{l as string}</div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <div className="num flex h-11 min-w-0 flex-1 items-center truncate rounded-full border border-line bg-bg px-4 text-[13px] text-muted">{inv.link.replace(/^https?:\/\//, "")}</div>
        <Button variant="lime" onClick={send} className="shrink-0">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Invite"}
        </Button>
      </div>
    </div>
  );
}

/** In-app "What's new": one card per new feature, dismissed per browser. */
const NEWS = [
  { id: "2026-11-invite", title: "Invite friends, earn scans", text: "Share your link: you both get 3 extra statement scans when a friend signs up." },
  { id: "2026-11-share", title: "Share your result", text: "One tap makes a clean image of your total (no merchants, no bank) to share." },
];

export function WhatsNew() {
  const [hidden, setHidden] = useState<string[] | null>(null);
  useEffect(() => {
    try {
      setHidden(JSON.parse(localStorage.getItem("bdg_news") || "[]"));
    } catch {
      setHidden([]);
    }
  }, []);
  if (!hidden) return null;
  const item = NEWS.find((n) => !hidden.includes(n.id));
  const close = () => {
    if (!item) return;
    const next = [...hidden, item.id];
    setHidden(next);
    try {
      localStorage.setItem("bdg_news", JSON.stringify(next));
    } catch {}
  };
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          className="flex items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
        >
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gain" />
          <div className="min-w-0 flex-1 text-sm">
            <span className="label-mono mr-2 text-muted">[ What&apos;s new ]</span>
            <span className="font-semibold">{item.title}.</span> <span className="text-muted">{item.text}</span>
          </div>
          <button onClick={close} aria-label="Dismiss" className="grid h-7 w-7 shrink-0 place-items-center rounded-full hover:bg-surface-2">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
