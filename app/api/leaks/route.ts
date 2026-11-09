import { z } from "zod";
import { supabaseServer, getUser } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";
import { fail, json, sameOrigin } from "@/lib/http";
import { track } from "@/lib/kwop";

const Body = z.object({
  merchant_key: z.string().min(1).max(80),
  merchant: z.string().min(1).max(80),
  monthly: z.number().min(0).max(100000),
  status: z.enum(["keep", "cancelled", "clear"]),
});

/** Mark a leak as cancelled (counts toward savings) or kept. */
export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const viewer = await getViewer();
  if (!viewer.user) return fail("Sign in first", 401);
  if (viewer.tier === 0) return fail("Unlock Budgeto to track your savings.", 402);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("Bad request");
  const sb = await supabaseServer();
  const b = parsed.data;
  if (b.status === "clear") {
    await sb.from("leak_actions").delete().eq("user_id", viewer.user.id).eq("merchant_key", b.merchant_key);
  } else {
    const { error } = await sb
      .from("leak_actions")
      .upsert({ user_id: viewer.user.id, merchant_key: b.merchant_key, merchant: b.merchant, monthly: b.monthly, status: b.status, updated_at: new Date().toISOString() }, { onConflict: "user_id,merchant_key" });
    if (error) return fail("Couldn't save. Try again.", 500);
    if (b.status === "cancelled") track("feature_used", viewer.user.email, "hidden_fee_hunter");
  }
  return json({ ok: true });
}

export async function GET() {
  const user = await getUser();
  if (!user) return fail("Sign in first", 401);
  const sb = await supabaseServer();
  const { data } = await sb.from("leak_actions").select("*").order("updated_at", { ascending: false });
  return json({ actions: data ?? [] });
}
