import { cancelPlan, track } from "@/lib/kwop";
import { getUser } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logEvent } from "@/lib/growth";
import { fail, json, sameOrigin } from "@/lib/http";

export async function POST() {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user?.email) return fail("Sign in first", 401);
  try {
    const r = await cancelPlan(user.email);
    await supabaseAdmin().from("profiles").update({ cancelled_at: new Date().toISOString() }).eq("id", user.id);
    logEvent("cancel", user.id);
    track("feature_used", user.email, "cancel");
    return json(r);
  } catch {
    return fail("We couldn't reach billing. Try again in a minute.", 502);
  }
}
