import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/shell";
import { getViewer } from "@/lib/viewer";
import { shortName } from "@/lib/quotas";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer.user) redirect("/login");
  return (
    <AppShell paid={viewer.plan.paid} tier={viewer.tier} planName={viewer.plan.plan ? shortName(viewer.plan.plan.name) : null} email={viewer.user.email}>
      {children}
    </AppShell>
  );
}
