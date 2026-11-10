import { json } from "@/lib/http";

export const dynamic = "force-dynamic";

/** The git commit this deployment was built from (used by .github/workflows/indexnow.yml to wait for a deploy). */
export function GET() {
  return json({ sha: process.env.VERCEL_GIT_COMMIT_SHA || null });
}
