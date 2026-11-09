import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { fail, json, sameOrigin } from "@/lib/http";
import { track } from "@/lib/kwop";

/** Called right after sign-up / log-in: attaches this device's tries to the account and saves k / plan / utm. */
export async function POST() {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user) return fail("Not signed in", 401);
  const store = await cookies();
  const db = supabaseAdmin();
  const device = store.get("bdg_dev")?.value;
  let claimed = 0;
  if (device) {
    const { data } = await db.from("reports").update({ user_id: user.id }).is("user_id", null).eq("device_id", device).select("id");
    claimed = data?.length ?? 0;
  }
  const { data: profile } = await db.from("profiles").select("kwop_k, intended_plan, source, created_at").eq("id", user.id).maybeSingle();
  const patch: Record<string, unknown> = {};
  const k = store.get("kwop_k")?.value;
  if (k && /^[A-Za-z0-9]{1,12}$/.test(k) && !profile?.kwop_k) patch.kwop_k = k;
  const plan = store.get("bdg_plan")?.value;
  if (plan && !profile?.intended_plan) patch.intended_plan = plan.slice(0, 40);
  const src = store.get("bdg_src")?.value;
  if (src && !profile?.source) {
    try {
      patch.source = JSON.parse(src);
    } catch {}
  }
  if (!profile) {
    await db.from("profiles").upsert({ id: user.id, email: user.email, ...patch });
  } else if (Object.keys(patch).length) {
    await db.from("profiles").update(patch).eq("id", user.id);
  }
  const isNew = !profile || Date.now() - Date.parse(profile.created_at) < 5 * 60 * 1000;
  if (isNew) track("signup", user.email);
  if (claimed > 0) track("onboarding_done", user.email);
  const { data: latest } = await db.from("reports").select("id").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  return json({ ok: true, claimed, latest: latest?.id ?? null });
}
