import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { REWARD, bonusLeft, inviteCode } from "@/lib/growth";
import { SITE_URL } from "@/lib/seo";
import { fail, json } from "@/lib/http";

/** The user's invite link and what they earned (counted on the server). */
export async function GET() {
  const user = await getUser();
  if (!user) return fail("Sign in first", 401);
  const code = await inviteCode(user.id);
  const [bonus, { count: friends }] = await Promise.all([
    bonusLeft(user.id),
    supabaseAdmin().from("rewards").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("kind", "invite_signup"),
  ]);
  return json({ code, link: `${SITE_URL}/i/${code}`, friends: friends ?? 0, earned: bonus.earned, left: bonus.left, reward: REWARD });
}
