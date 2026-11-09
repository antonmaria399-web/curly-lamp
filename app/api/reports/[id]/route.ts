import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getViewer } from "@/lib/viewer";
import { fail, json, sameOrigin } from "@/lib/http";
import { lock, gate } from "@/lib/redact";
import type { ReportResult } from "@/lib/types";

const UUID = /^[0-9a-f-]{36}$/i;

async function load(id: string) {
  if (!UUID.test(id)) return null;
  const viewer = await getViewer();
  const device = (await cookies()).get("bdg_dev")?.value;
  const { data } = await supabaseAdmin().from("reports").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  const mine = viewer.user ? data.user_id === viewer.user.id : !data.user_id && device && data.device_id === device;
  if (!mine) return null;
  return { viewer, row: data };
}

export async function GET(_: Request, ctx: RouteContext<"/api/reports/[id]">) {
  const { id } = await ctx.params;
  const r = await load(id);
  if (!r) return fail("Report not found", 404);
  const result = r.row.result as ReportResult;
  const out = r.viewer.tier === 0 ? lock(result) : gate(result, { fees: r.viewer.limits.fees });
  return json({ id: r.row.id, file_name: r.row.file_name, created_at: r.row.created_at, shared: r.row.shared, result: out });
}

export async function PATCH(req: Request, ctx: RouteContext<"/api/reports/[id]">) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const { id } = await ctx.params;
  const r = await load(id);
  if (!r || !r.viewer.user) return fail("Report not found", 404);
  if (r.viewer.tier === 0) return fail("Unlock your report to share it.", 402);
  const body = await req.json().catch(() => ({}));
  if (typeof body.shared !== "boolean") return fail("Bad request");
  await supabaseAdmin().from("reports").update({ shared: body.shared }).eq("id", id).eq("user_id", r.viewer.user.id);
  return json({ ok: true, shared: body.shared });
}

export async function DELETE(_: Request, ctx: RouteContext<"/api/reports/[id]">) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const { id } = await ctx.params;
  const r = await load(id);
  if (!r) return fail("Report not found", 404);
  await supabaseAdmin().from("reports").delete().eq("id", id);
  return json({ ok: true });
}
