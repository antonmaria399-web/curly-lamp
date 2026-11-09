import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser, supabaseServer } from "@/lib/supabase/server";
import { cancelPlan, getPlan } from "@/lib/kwop";
import { fail, json, sameOrigin } from "@/lib/http";

/** Delete my account and all my data (reports, leaks, rules, profile). Active plan is cancelled first. */
export async function DELETE() {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user) return fail("Sign in first", 401);
  try {
    const p = await getPlan(user.email, { fresh: true });
    if (p.paid && user.email) await cancelPlan(user.email);
  } catch {}
  const db = supabaseAdmin();
  await db.from("reports").delete().eq("user_id", user.id);
  await db.from("tries").delete().eq("user_id", user.id);
  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) return fail("We couldn't delete your account. Try again.", 500);
  const sb = await supabaseServer();
  await sb.auth.signOut();
  return json({ ok: true });
}

export async function PATCH(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user) return fail("Sign in first", 401);
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 60) : null;
  const sb = await supabaseServer();
  await sb.from("profiles").update({ name }).eq("id", user.id);
  return json({ ok: true });
}
