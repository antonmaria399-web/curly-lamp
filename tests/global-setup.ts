import { execSync } from "node:child_process";

// Fresh free-scan counters so the "3 free scans a day" limit doesn't trip on reruns (local DB only).
export default function setup() {
  const db = process.env.TEST_DB_URL || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
  if (!/127\.0\.0\.1|localhost/.test(db)) throw new Error("global-setup only touches a local database");
  execSync(`psql "${db}" -c "truncate table public.tries"`, { stdio: "inherit" });
}
