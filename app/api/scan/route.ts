import { cookies } from "next/headers";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { scanStatement, ScanError } from "@/lib/ai";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getViewer, periodStart, scansUsed } from "@/lib/viewer";
import { lock, gate } from "@/lib/redact";
import { clientIp, fail, json, sameOrigin } from "@/lib/http";
import { track } from "@/lib/kwop";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX = 10 * 1024 * 1024;
const TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(req: Request) {
  if (!(await sameOrigin())) return fail("Bad origin", 403);
  const store = await cookies();
  const device = store.get("bdg_dev")?.value || null;
  const ip = await clientIp();
  const viewer = await getViewer();
  const db = supabaseAdmin();

  // Limits: free = 3 a day per device AND per IP (and per account); paid = plan quota per billing period.
  if (viewer.tier === 0) {
    const since = new Date(Date.now() - 86400000).toISOString();
    const q = (col: string, val: string) =>
      db.from("tries").select("id", { count: "exact", head: true }).eq(col, val).gte("created_at", since);
    const checks = await Promise.all([
      device ? q("device_id", device) : Promise.resolve({ count: 0 }),
      q("ip", ip),
      viewer.user ? q("user_id", viewer.user.id) : Promise.resolve({ count: 0 }),
    ]);
    const free = Number(process.env.FREE_TRIES_PER_DAY) || 3;
    if (checks.some((c) => (c.count ?? 0) >= free)) {
      return fail(`You've used your ${free} free scans for today. Unlock Budgeto to keep scanning.`, 429, { code: "free_limit" });
    }
  } else {
    const used = await scansUsed(viewer.user!.id, periodStart(viewer.plan.until));
    if (used >= viewer.limits.scans) {
      return fail(`You've used all ${viewer.limits.scans} scans of this month.`, 429, { code: "quota", used, limit: viewer.limits.scans });
    }
  }

  let bytes: Uint8Array;
  let mime: string;
  let name: string;
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData().catch(() => null);
    const sample = form?.get("sample");
    const file = form?.get("file");
    if (sample === "1") {
      bytes = new Uint8Array(await readFile(path.join(process.cwd(), "public", "sample-statement.pdf")));
      mime = "application/pdf";
      name = "Sample statement.pdf";
    } else if (file && typeof file === "object" && "arrayBuffer" in file) {
      const f = file as File;
      if (f.size === 0) return fail("This file is empty.");
      if (f.size > MAX) return fail("This file is over 10 MB. Export a shorter period from your bank.");
      mime = f.type || (f.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "");
      if (!TYPES.includes(mime)) return fail("Upload a PDF statement (or a photo of it).");
      bytes = new Uint8Array(await f.arrayBuffer());
      if (mime === "application/pdf" && !(bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46)) {
        return fail("This file isn't a valid PDF.");
      }
      name = String(f.name || "statement.pdf").replace(/[^\w .()\-]/g, "").slice(0, 80) || "statement.pdf";
    } else return fail("Choose a PDF statement first.");
  } else return fail("Choose a PDF statement first.");

  // Custom savings rules (Power).
  let rules: { kind: string; value: string }[] = [];
  if (viewer.user && viewer.limits.rules) {
    const { data } = await db.from("rules").select("kind,value").eq("user_id", viewer.user.id);
    rules = data ?? [];
  }

  let result;
  try {
    result = await scanStatement(bytes, mime, rules);
  } catch (e) {
    if (e instanceof ScanError) return fail(e.message, 422, { code: e.code });
    console.error("[scan]", e);
    return fail("Something went wrong while reading your statement. Try again.", 500);
  }
  // The file itself is never stored: only the leak report.
  const { data: row, error } = await db
    .from("reports")
    .insert({ user_id: viewer.user?.id ?? null, device_id: device, file_name: name, result })
    .select("id, created_at")
    .single();
  if (error) {
    console.error("[scan] insert", error.message);
    return fail("We couldn't save your report. Try again.", 500);
  }
  if (viewer.tier === 0) await db.from("tries").insert({ device_id: device, ip, user_id: viewer.user?.id ?? null });
  if (viewer.user) track("feature_used", viewer.user.email, "pdf_statement_scan");

  const out = viewer.tier === 0 ? lock(result) : gate(result, { fees: viewer.limits.fees });
  return json({ id: row.id, file_name: name, created_at: row.created_at, result: out });
}
