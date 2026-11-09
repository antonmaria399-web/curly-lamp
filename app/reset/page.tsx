"use client";
import { useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function ResetPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <AuthShell title="Choose a new password" track={false}>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          if (pw.length < 8) return setErr("Use at least 8 characters.");
          setBusy(true);
          const { error } = await supabaseBrowser().auth.updateUser({ password: pw });
          setBusy(false);
          if (error) return setErr("This link expired. Ask for a new one from “Forgot password”.");
          window.location.assign("/dashboard");
        }}
      >
        <input
          type="password"
          autoComplete="new-password"
          placeholder="New password (8+ characters)"
          aria-label="New password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="h-13 w-full rounded-2xl border border-line bg-surface px-4 text-[16px] outline-none focus:border-fg/40"
        />
        {err && <p className="text-sm text-loss">{err}</p>}
        <Button type="submit" size="lg" className="w-full" loading={busy}>
          Save and continue
        </Button>
      </form>
    </AuthShell>
  );
}
