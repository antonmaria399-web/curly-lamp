import { supabaseServer, getUser } from "@/lib/supabase/server";
import { fail, json, sameOrigin } from "@/lib/http";
import { NEWS } from "@/lib/news";

/** Mark "What's new" as read. */
export async function POST() {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user) return fail("Sign in first", 401);
  const sb = await supabaseServer();
  await sb.from("profiles").update({ last_seen_news: NEWS[0].id }).eq("id", user.id);
  return json({ ok: true });
}
