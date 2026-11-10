import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { AuthForm } from "@/components/funnel/auth-form";

export const metadata: Metadata = { title: "Create your account", description: "Save your leak report and find every subscription you forgot.", robots: { index: false, follow: true } };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : "/upload";
  return (
    <AuthShell title="Find your leaks" sub="Create your account, then drop your first statement.">
      <AuthForm mode="signup" next={next} />
    </AuthShell>
  );
}
