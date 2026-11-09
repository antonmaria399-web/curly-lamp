"use client";
import { useEffect } from "react";
import { useUnlock } from "@/components/funnel/unlock";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PricingClient() {
  const { openPaywall, paid } = useUnlock();
  const router = useRouter();
  useEffect(() => {
    if (!paid) openPaywall();
  }, [openPaywall, paid]);
  return (
    <div className="py-10 text-center">
      <h1 className="text-[30px] font-semibold tracking-[-0.03em]">{paid ? "You're all set" : "Your leak report is ready."}</h1>
      <p className="mt-2 text-muted">{paid ? "Manage your plan from Account." : "Pick the plan that fits, and unlock it."}</p>
      <div className="mt-6 flex justify-center gap-2">
        {paid ? <Button onClick={() => router.push("/account#billing")}>Go to billing</Button> : <Button variant="lime" size="lg" onClick={openPaywall}>See plans</Button>}
      </div>
    </div>
  );
}
