import { getViewer } from "@/lib/viewer";
import { supabaseServer } from "@/lib/supabase/server";
import { slideImage, slidesFor } from "@/lib/og";
import { gate } from "@/lib/redact";
import { track } from "@/lib/kwop";
import type { ReportResult } from "@/lib/types";

/** Faceless Export: 1080×1920 stat screens (Pro and up). No name, no account numbers. */
export async function GET(req: Request, ctx: RouteContext<"/api/export/[id]/[slide]">) {
  const { id, slide } = await ctx.params;
  const viewer = await getViewer();
  if (!viewer.user || !viewer.limits.export) return new Response("Export comes with Pro.", { status: 402 });
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
  const sb = await supabaseServer();
  const { data } = await sb.from("reports").select("result").eq("id", id).maybeSingle();
  if (!data) return new Response("Not found", { status: 404 });
  const slides = slidesFor(gate(data.result as ReportResult, { fees: viewer.limits.fees }));
  const i = Math.max(0, Math.min(slides.length - 1, Number(slide) || 0));
  if (new URL(req.url).searchParams.get("dl") === "1") track("feature_used", viewer.user.email, "faceless_export");
  const res = slideImage(slides[i], { width: 1080, height: 1920 });
  res.headers.set("Cache-Control", "private, max-age=300");
  return res;
}
