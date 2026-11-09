import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { getViewer } from "@/lib/viewer";
import { fail, json, sameOrigin } from "@/lib/http";

const Body = z.object({
  kind: z.enum(["flag_over", "ignore_merchant", "watch_category"]),
  value: z.string().trim().min(1).max(80),
});

export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const viewer = await getViewer();
  if (!viewer.user) return fail("Sign in first", 401);
  if (!viewer.limits.rules) return fail("Custom savings rules come with Power.", 402);
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("Check the rule and try again.");
  if (parsed.data.kind === "flag_over" && !(Number(parsed.data.value) > 0)) return fail("Enter an amount, like 15.");
  const sb = await supabaseServer();
  const { count } = await sb.from("rules").select("id", { count: "exact", head: true });
  if ((count ?? 0) >= 25) return fail("You can have up to 25 rules.");
  const { data, error } = await sb.from("rules").insert({ user_id: viewer.user.id, ...parsed.data }).select().single();
  if (error) return fail("Couldn't save the rule. Try again.", 500);
  return json({ rule: data });
}

export async function DELETE(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const viewer = await getViewer();
  if (!viewer.user) return fail("Sign in first", 401);
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return fail("Bad request");
  const sb = await supabaseServer();
  await sb.from("rules").delete().eq("id", id);
  return json({ ok: true });
}
