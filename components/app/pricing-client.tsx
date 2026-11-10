"use client";
import { useEffect } from "react";
import { useUnlock } from "@/components/funnel/unlock";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const short = (name: string) => name.replace(/^Budgeto\s+/i, "");

/** Free → the paywall. Paid below the top plan → the next plan only (upgrade sheet). Top plan → billing. */
export function PricingClient() {
  const { openPaywall, openUpgrade, paid, currentTier, plans } = useUnlock();
  const router = useRouter();
  const top = Math.max(0, ...plans.map((p) => p.tier));
  const current = plans.find((p) => p.tier === currentTier);
  const next = paid ? plans.find((p) => p.tier === currentTier + 1) : undefined;

  useEffect(() => {
    if (!paid) openPaywall();
    else if (next) openUpgrade(next.tier as 2 | 3);
  }, [openPaywall, openUpgrade, paid, next]);

  const title = !paid ? "Your leak report is ready." : current ? `You're on ${short(current.name)}` : "You're all set";
  const sub = !paid
    ? "Pick the plan that fits, and unlock it."
    : next
      ? `${short(next.name)} adds more scans and the features marked “Unlock with ${short(next.name)}”.`
      : currentTier >= top && top > 0
        ? "You have every feature. Manage your plan from Account."
        : "Manage your plan from Account.";

  return (
    <div className="py-10 text-center">
      <h1 className="text-[30px] font-semibold tracking-[-0.03em]">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-balance text-muted">{sub}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {!paid ? (
          <Button variant="lime" size="lg" onClick={openPaywall}>
            See plans
          </Button>
        ) : (
          <>
            {next && (
              <Button variant="lime" onClick={() => openUpgrade(next.tier as 2 | 3)}>
                See {short(next.name)}
              </Button>
            )}
            <Button variant={next ? "outline" : undefined} onClick={() => router.push("/account#billing")}>
              Go to billing
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
