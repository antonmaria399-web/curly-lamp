import { supabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/server";
import { fail, json } from "@/lib/http";
import { REWARD, inviteCode, siteUrl } from "@/lib/growth";

/** The user's invite link and what it earned them (counted on the server). */
export async function GET() {
  const user = await getUser();
  if (!user) return fail("Sign in first", 401);
  const code = await inviteCode(user.id).catch(() => null);
  if (!code) return fail("Try again in a minute.", 500);
  const db = supabaseAdmin();
  const [{ data: rows }, { data: prof }] = await Promise.all([
    db.from("invite_rewards").select("kind, scans").eq("user_id", user.id),
    db.from("profiles").select("bonus_scans").eq("id", user.id).maybeSingle(),
  ]);
  const r = rows ?? [];
  return json({
    code,
    url: `${siteUrl()}/i/${code}`,
    friends: r.filter((x) => x.kind === "friend_signup").length,
    paid: r.filter((x) => x.kind === "friend_paid").length,
    earned: r.reduce((s, x) => s + x.scans, 0),
    bonus: prof?.bonus_scans ?? 0,
    reward: REWARD,
  });
}
