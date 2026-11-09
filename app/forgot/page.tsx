"use client";
import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  return (
    <AuthShell title="Reset your password" sub="We'll email you a link to choose a new one." track={false}>
      {state === "sent" ? (
        <p className="rounded-2xl bg-gain/10 p-4 text-[15px]">
          If <b>{email}</b> has an account, a reset link is on its way. Check your inbox (and spam).
        </p>
      ) : (
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setState("error");
            setState("busy");
            await supabaseBrowser().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/auth/callback?next=/reset` });
            setState("sent");
          }}
        >
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-13 w-full rounded-2xl border border-line bg-surface px-4 text-[16px] outline-none focus:border-fg/40"
          />
          {state === "error" && <p className="text-sm text-loss">Enter a valid email, like you@gmail.com.</p>}
          <Button type="submit" size="lg" className="w-full" loading={state === "busy"}>
            Send me a reset link
          </Button>
        </form>
      )}
      <Link href="/login" className="mt-5 block text-center text-sm font-medium underline-offset-4 hover:underline">
        Back to log in
      </Link>
    </AuthShell>
  );
}
