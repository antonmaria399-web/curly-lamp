import type { Metadata } from "next";
import { getViewer } from "@/lib/viewer";
import { myProfile } from "@/lib/data";
import { shortName } from "@/lib/quotas";
import { BillingCard, DangerZone, ProfileForm } from "@/components/app/settings-forms";
import { InviteCard } from "@/components/app/invite";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const viewer = await getViewer({ fresh: true });
  const profile = await myProfile();
  return (
    <div className="space-y-10">
      <h1 className="text-[30px] font-semibold tracking-[-0.03em]">Account</h1>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Profile</h2>
        <ProfileForm name={profile?.name ?? viewer.user?.name ?? ""} email={viewer.user!.email} />
      </section>
      <section className="space-y-3" id="billing">
        <h2 className="text-lg font-semibold">Plan & billing</h2>
        <BillingCard
          paid={viewer.plan.paid}
          planName={viewer.plan.plan ? shortName(viewer.plan.plan.name) : null}
          until={viewer.plan.until}
          status={viewer.plan.status}
          tier={viewer.tier}
        />
        <p className="text-xs text-muted">Payments are processed by Whop for Budgeto. Prices in USD.</p>
      </section>
      <section className="space-y-3" id="invite">
        <h2 className="text-lg font-semibold">Invite friends</h2>
        <InviteCard />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Language</h2>
        <p className="text-sm text-muted">English (US) · amounts in USD</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Leave</h2>
        <DangerZone />
      </section>
    </div>
  );
}
