"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { GoogleG } from "@/components/ui/google";
import { cn } from "@/lib/cn";

export const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "1";

/** Sign-up / log-in: Google first and biggest, then email + password. No email confirmation, no extra field. */
export function AuthForm({
  mode: initial = "signup",
  next = "/dashboard",
  onDone,
  inSheet,
}: {
  mode?: "signup" | "login";
  next?: string;
  onDone?: () => void;
  inSheet?: boolean;
}) {
  const [mode, setMode] = useState(initial);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const [err, setErr] = useState<{ field: "email" | "password" | "form"; msg: string; login?: boolean } | null>(null);

  async function google() {
    setBusy("google");
    const sb = supabaseBrowser();
    const back = inSheet ? window.location.pathname + window.location.search : next;
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(back)}` },
    });
    if (error) {
      setBusy(null);
      setErr({ field: "form", msg: "Google sign-in isn't available right now. Use your email below." });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr({ field: "email", msg: "Enter a valid email, like you@gmail.com." });
    if (password.length < 8) return setErr({ field: "password", msg: "Use at least 8 characters." });
    setBusy("email");
    const sb = supabaseBrowser();
    const { error } =
      mode === "signup"
        ? await sb.auth.signUp({ email: email.trim(), password })
        : await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setBusy(null);
      const m = error.message.toLowerCase();
      if (m.includes("already registered") || m.includes("already exists"))
        return setErr({ field: "email", msg: "This email already has an account.", login: true });
      if (m.includes("invalid login")) return setErr({ field: "password", msg: "Wrong email or password. Try again or reset it." });
      if (m.includes("rate")) return setErr({ field: "form", msg: "Too many tries. Wait a minute and try again." });
      return setErr({ field: "form", msg: "Something went wrong. Try again." });
    }
    await fetch("/api/claim", { method: "POST" }).catch(() => {});
    if (onDone) {
      setBusy(null);
      onDone();
    } else {
      window.location.assign(next);
    }
  }

  return (
    <div className="w-full">
      {googleEnabled && (
        <>
          <button
            onClick={google}
            disabled={busy !== null}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-black/10 bg-white text-[16px] font-semibold text-ink shadow-sm transition hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-60"
          >
            <GoogleG /> Continue with Google
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
          </div>
        </>
      )}
      <form onSubmit={submit} className="space-y-3" noValidate>
        <div>
          <label htmlFor="auth-email" className="sr-only">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "h-13 w-full rounded-2xl border bg-surface px-4 text-[16px] outline-none transition placeholder:text-muted focus:border-fg/40",
              err?.field === "email" ? "border-loss" : "border-line",
            )}
          />
          {err?.field === "email" && (
            <p className="mt-1.5 text-sm text-loss">
              {err.msg}{" "}
              {err.login && (
                <button type="button" className="font-semibold underline" onClick={() => (setMode("login"), setErr(null))}>
                  Log in?
                </button>
              )}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="auth-password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <input
              id="auth-password"
              type={show ? "text" : "password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder={mode === "signup" ? "Create a password (8+ characters)" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "h-13 w-full rounded-2xl border bg-surface pl-4 pr-12 text-[16px] outline-none transition placeholder:text-muted focus:border-fg/40",
                err?.field === "password" ? "border-loss" : "border-line",
              )}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-fg"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {err?.field === "password" && <p className="mt-1.5 text-sm text-loss">{err.msg}</p>}
        </div>
        {err?.field === "form" && <p className="text-sm text-loss">{err.msg}</p>}
        <Button type="submit" variant="ink" size="lg" className="w-full" loading={busy === "email"}>
          {mode === "signup" ? "Create my account" : "Log in"}
        </Button>
      </form>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        {mode === "signup" ? (
          <span>
            Already have an account?{" "}
            <button className="font-semibold text-fg underline-offset-4 hover:underline" onClick={() => (setMode("login"), setErr(null))}>
              Log in
            </button>
          </span>
        ) : (
          <span>
            New here?{" "}
            <button className="font-semibold text-fg underline-offset-4 hover:underline" onClick={() => (setMode("signup"), setErr(null))}>
              Create an account
            </button>
          </span>
        )}
        {mode === "login" && (
          <Link href="/forgot" className="font-medium text-fg underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        )}
      </div>
      <p className="mt-5 text-center text-xs text-muted">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline">
          Privacy
        </Link>
        .
      </p>
    </div>
  );
}
