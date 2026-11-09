import { cancelPlan } from "@/lib/kwop";
import { getUser } from "@/lib/supabase/server";
import { fail, json, sameOrigin } from "@/lib/http";

export async function POST() {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const user = await getUser();
  if (!user?.email) return fail("Sign in first", 401);
  try {
    const r = await cancelPlan(user.email);
    return json(r);
  } catch {
    return fail("We couldn't reach billing. Try again in a minute.", 502);
  }
}
