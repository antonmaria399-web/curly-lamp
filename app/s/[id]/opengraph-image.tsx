import { supabaseAdmin } from "@/lib/supabase/admin";
import { slideImage } from "@/lib/og";
import { usd } from "@/lib/cn";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A Budgeto leak report";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = /^[0-9a-f-]{36}$/i.test(id) ? await supabaseAdmin().from("reports").select("result, shared").eq("id", id).maybeSingle() : { data: null };
  const r = data?.shared ? (data.result as { monthly_leaks: number; leaks: unknown[] }) : null;
  return slideImage(
    r ? { top: `Found ${r.leaks.length} forgotten charges`, big: `${usd(r.monthly_leaks)}/mo`, bottom: "in 5 seconds with Budgeto" } : { top: "Find the subscriptions", big: "you forgot", bottom: "Budgeto" },
    size,
  );
}
