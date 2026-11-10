"use client";
import { useEffect, useState } from "react";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Invite = { code: string; url: string; friends: number; paid: number; earned: number; bonus: number; reward: { friendSignup: number; friendPaid: number } };

let cache: Promise<Invite | null> | null = null;
export function useInvite() {
  const [inv, setInv] = useState<Invite | null>(null);
  useEffect(() => {
    cache ??= fetch("/api/invite")
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    cache.then(setInv);
  }, []);
  return inv;
}

function event(type: string, detail?: string) {
  fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, detail }), keepalive: true }).catch(() => {});
}

/** Invite friends: a friend who signs up gives both extra scans; a friend who pays gives the inviter more. */
export function InviteCard({ compact, className }: { compact?: boolean; className?: string }) {
  const inv = useInvite();
  const [copied, setCopied] = useState(false);
  if (!inv) return <div className={cn("skeleton h-[148px] rounded-[20px]", className)} />;
  const send = async () => {
    event("invite_sent");
    try {
      if (navigator.share) {
        await navigator.share({ title: "Budgeto", text: "This found the subscriptions I forgot I was paying for. Free to try, no bank login:", url: inv.url });
        return;
      }
    } catch {
      return;
    }
    await navigator.clipboard?.writeText(inv.url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={cn("rounded-[20px] border border-line bg-surface p-5", className)}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-ink">
          <Gift className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold">Invite a friend, both get {inv.reward.friendSignup} extra scans</h3>
          <p className="mt-0.5 text-sm text-muted">
            If they subscribe, you get {inv.reward.friendPaid} more. Extra scans add to your plan&apos;s monthly scans.
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="num flex h-11 min-w-0 flex-1 items-center truncate rounded-xl border border-line bg-surface-2 px-3 text-[13px] text-muted">{inv.url.replace(/^https?:\/\//, "")}</div>
        <button onClick={send} className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-fg px-4 text-sm font-semibold text-bg active:scale-95" aria-label="Share your invite link">
          {copied ? <Check className="h-4 w-4" /> : typeof navigator !== "undefined" && "share" in navigator ? <Share2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Invite"}
        </button>
      </div>
      {!compact && (
        <div className="num mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted">
          <div className="rounded-xl bg-surface-2 py-2.5">
            <div className="text-lg font-semibold text-fg">{inv.friends}</div>friends joined
          </div>
          <div className="rounded-xl bg-surface-2 py-2.5">
            <div className="text-lg font-semibold text-fg">{inv.paid}</div>subscribed
          </div>
          <div className="rounded-xl bg-surface-2 py-2.5">
            <div className="text-lg font-semibold text-gain">+{inv.bonus}</div>extra scans left
          </div>
        </div>
      )}
    </div>
  );
}

/** "What's new" card: the features added since the last visit. Dismissed once read. */
export function WhatsNew({ items }: { items: { id: number; title: string; body: string; href: string }[] }) {
  const [open, setOpen] = useState(true);
  if (!open || items.length === 0) return null;
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="label-mono text-muted">[ What&apos;s new ]</div>
        <button
          className="text-sm font-medium text-muted hover:text-fg"
          onClick={() => {
            setOpen(false);
            fetch("/api/news", { method: "POST" }).catch(() => {});
          }}
        >
          Got it
        </button>
      </div>
      <ul className="mt-3 space-y-3">
        {items.slice(0, 3).map((n) => (
          <li key={n.id}>
            <a href={n.href} className="block rounded-xl transition hover:bg-surface-2/60">
              <div className="font-medium">{n.title}</div>
              <p className="text-sm text-muted">{n.body}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
