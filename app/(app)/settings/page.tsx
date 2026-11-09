import type { Metadata } from "next";
import { getViewer } from "@/lib/viewer";
import { supabaseServer } from "@/lib/supabase/server";
import { RulesEditor, ThemePicker } from "@/components/app/settings-forms";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const viewer = await getViewer();
  const sb = await supabaseServer();
  const { data: rules } = await sb.from("rules").select("id, kind, value").order("created_at");
  return (
    <div className="space-y-10">
      <h1 className="text-[30px] font-semibold tracking-[-0.03em]">Settings</h1>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <ThemePicker />
      </section>
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Custom savings rules</h2>
          <p className="text-sm text-muted">Tell Budgeto what to flag (or ignore) on your next scans.</p>
        </div>
        <RulesEditor rules={(rules ?? []) as never} enabled={viewer.limits.rules} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Your data</h2>
        <p className="text-sm text-muted">
          Statement files are read once and never stored. Your reports live in our database (Supabase, US) until you delete them from Upload → Your reports, or delete your account.
        </p>
      </section>
    </div>
  );
}
