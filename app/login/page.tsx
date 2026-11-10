import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/funnel/auth-form";

export const metadata: Metadata = { title: "Log in", description: "Log in to Budgeto to see your leak reports.", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/dashboard";
  return (
    <AuthShell title="Welcome back" sub="Your leak reports are waiting.">
      <AuthForm mode="login" next={next} />
    </AuthShell>
  );
}
