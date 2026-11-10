// Technical SEO check of every page in the sitemap (+ private screens and a 404).
// Usage: node scripts/seo-check.mjs [baseUrl]   (default http://localhost:3000)
// Checks: status 200, one <title> ≤ 60, one description ≤ 155, exactly one H1, self canonical,
// og:image that loads as a PNG, JSON-LD that parses (types listed), images with alt + size,
// ≥ 3 internal links, no noindex; private screens noindex; unknown URL → real 404; robots.txt + sitemap.
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
let fails = 0;
const bad = (m) => {
  fails++;
  console.log("  ✗ " + m);
};
const get = async (u, opt = {}) => fetch(u, { redirect: "manual", headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }, ...opt });
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const all = (html, re) => [...html.matchAll(re)];
const meta = (html, attr, name) => {
  const m = html.match(new RegExp(`<meta[^>]+${attr}="${name}"[^>]*content="([^"]*)"`, "i")) || html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+${attr}="${name}"`, "i"));
  return m ? decode(m[1]) : null;
};

const robots = await (await get(base + "/robots.txt")).text();
console.log("robots.txt:\n" + robots.trim().replace(/^/gm, "  "));
if (!/Sitemap: .*\/sitemap\.xml/.test(robots)) bad("robots.txt has no Sitemap line");
const sm = await (await get(base + "/sitemap.xml")).text();
const urls = all(sm, /<loc>([^<]+)<\/loc>/g).map((m) => m[1]);
console.log(`sitemap.xml: ${urls.length} URLs`);
const origin = urls[0] ? new URL(urls[0]).origin : base;

for (const u of urls) {
  const path = new URL(u).pathname;
  const r = await get(base + path);
  const html = await r.text();
  const titles = all(html, /<title>([^<]*)<\/title>/g).map((m) => decode(m[1]));
  const title = titles[0] || "";
  const desc = meta(html, "name", "description") || "";
  const h1s = all(html, /<h1[\s>]/g).length;
  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const og = meta(html, "property", "og:image");
  const robotsMeta = meta(html, "name", "robots") || "";
  const ld = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((m) => m[1]);
  const types = [];
  let ldOk = true;
  for (const block of ld) {
    try {
      const j = JSON.parse(block);
      for (const x of [].concat(j)) types.push(x["@type"]);
    } catch {
      ldOk = false;
    }
  }
  const imgs = all(html, /<img\b[^>]*>/g).map((m) => m[0]);
  const imgBad = imgs.filter((i) => !/\balt="/.test(i) || !/\bwidth="/.test(i) || !/\bheight="/.test(i));
  const internal = new Set(all(html, /<a [^>]*href="(\/[^"#?]*)"/g).map((m) => m[1]).filter((h) => h !== path));
  console.log(`\n${path}  [${r.status}]  title ${title.length}c · desc ${desc.length}c · h1 ${h1s} · ld: ${types.join(", ") || "none"} · internal links ${internal.size}`);
  console.log(`  title: ${title}`);
  if (r.status !== 200) bad("status " + r.status);
  if (titles.length !== 1) bad(`${titles.length} <title> tags`);
  if (title.length > 60) bad("title > 60 characters");
  if (!desc) bad("no meta description");
  if (desc.length > 155) bad("description > 155 characters");
  if (h1s !== 1) bad(`${h1s} H1`);
  if (canon !== origin + (path === "/" ? "" : path) && canon !== origin + path) bad(`canonical ${canon}`);
  if (/noindex/.test(robotsMeta) || /noindex/.test(r.headers.get("x-robots-tag") || "")) bad("noindex on a public page");
  if (!ldOk) bad("JSON-LD does not parse");
  if (path !== "/privacy" && path !== "/terms") {
    if (!types.includes("Organization")) bad("no Organization JSON-LD");
    if (path !== "/" && !types.includes("BreadcrumbList")) bad("no BreadcrumbList");
    if (!types.includes("SoftwareApplication")) bad("no SoftwareApplication");
  }
  if (imgBad.length) bad(`${imgBad.length} <img> without alt/width/height`);
  if (internal.size < 3) bad("fewer than 3 internal links");
  if (!og) bad("no og:image");
  else {
    const ir = await get(og.replace(origin, base));
    if (ir.status !== 200 || !/image\/png/.test(ir.headers.get("content-type") || "")) bad(`og:image ${og} → ${ir.status} ${ir.headers.get("content-type")}`);
  }
  const app = types.includes("SoftwareApplication") ? ld.map((b) => [].concat(JSON.parse(b))).flat().find((x) => x["@type"] === "SoftwareApplication") : null;
  if (app) console.log("  offers: " + app.offers.map((o) => `${o.name} $${o.price}`).join(" · "));
}

console.log("\nPrivate screens (must be noindex):");
for (const p of ["/login", "/signup", "/forgot", "/dashboard", "/s/00000000-0000-0000-0000-000000000000"]) {
  const r = await get(base + p);
  const html = r.status === 200 || r.status === 404 ? await r.text() : "";
  const no = /noindex/.test(r.headers.get("x-robots-tag") || "") || /<meta name="robots" content="[^"]*noindex/.test(html);
  console.log(`  ${p} [${r.status}] ${no ? "noindex ✓" : ""}`);
  if (!no) bad(p + " is indexable");
}
const nf = await get(base + "/this-page-does-not-exist");
console.log(`\n404 page: status ${nf.status}`);
if (nf.status !== 404) bad("unknown URL does not return 404");
const sl = urls.filter((u) => !/\/(privacy|terms)$/.test(u)).length;
console.log(`\n${fails ? fails + " problem(s)" : "All checks passed"} (${sl} SEO pages)`);
process.exit(fails ? 1 : 0);
