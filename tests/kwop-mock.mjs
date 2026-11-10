// Local stand-in for the Kwop API, used ONLY by the e2e test (never by the app in production).
// Plans mirror the owner's current Kwop plans so the paywall renders like the real one.
import http from "node:http";

const PORT = Number(process.env.KWOP_MOCK_PORT || 4010);
const plans = [
  { id: 101, name: "Starter", price_cents: 500, currency: "usd", interval: "month", per_day: "$0.17", yearly: { price_cents: 4800, per_day: "$0.13" } },
  { id: 102, name: "Pro", price_cents: 900, currency: "usd", interval: "month", per_day: "$0.30", yearly: { price_cents: 8600, per_day: "$0.24" } },
  { id: 103, name: "Power", price_cents: 1900, currency: "usd", interval: "month", per_day: "$0.63", yearly: { price_cents: 18200, per_day: "$0.50" } },
];
const refs = new Map(); // ref -> { email, plan }
const paid = new Map(); // email -> plan
let n = 0;

const body = (req) => new Promise((res) => { let s = ""; req.on("data", (c) => (s += c)); req.on("end", () => { try { res(JSON.parse(s || "{}")); } catch { res({}); } }); });
const send = (res, code, j) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(j)); };

http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  const p = u.pathname.replace(/\/$/, "");
  if (req.method === "GET" && p === "") return send(res, 200, { name: "Budgeto", checkout: "embedded", plans });
  if (req.method === "GET" && p === "/plan") {
    const plan = paid.get((u.searchParams.get("email") || "").toLowerCase());
    return send(res, 200, plan ? { paid: true, plan: { id: plan.id, name: plan.name }, status: "active", until: plan.until } : { paid: false, plan: null, status: null, until: null });
  }
  const b = await body(req);
  if (p === "/checkout") {
    if (String(b.email).startsWith("off-")) return send(res, 409, { error: "payments_off" });
    const ref = "ref_test_" + ++n;
    refs.set(ref, { email: String(b.email).toLowerCase(), plan: plans.find((x) => x.id === b.plan) });
    return send(res, 200, { embed: "cfg_" + ref, ref, fallback_url: null });
  }
  if (p === "/confirm") {
    const r = refs.get(b.ref);
    if (!r) return send(res, 200, { ok: false, paid: false });
    // Renewal date fixed at payment time, like a real subscription.
    paid.set(r.email, { ...r.plan, until: new Date(Date.now() + 30 * 864e5).toISOString() });
    return send(res, 200, { ok: true, paid: true });
  }
  if (p === "/cancel") { paid.delete(String(b.email).toLowerCase()); return send(res, 200, { message: "Canceled. You keep access until the end of the period." }); }
  if (p === "/event" || p === "/connect") return send(res, 200, { ok: true });
  send(res, 404, { error: "not_found" });
}).listen(PORT, () => console.log("kwop mock on " + PORT));
