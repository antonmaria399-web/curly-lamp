import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SITE_HOST, SITE_URL, isPrivatePath } from "@/lib/seo";

const APP_PATHS = ["/dashboard", "/upload", "/leaks", "/settings", "/account", "/reports", "/export", "/pricing"];
const YEAR = 60 * 60 * 24 * 365;

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // One canonical domain: any other host serving the production build (other *.vercel.app aliases) → 301.
  const host = request.headers.get("host") || "";
  if (process.env.VERCEL_ENV === "production" && host && host !== SITE_HOST) {
    return NextResponse.redirect(`${SITE_URL}${url.pathname}${url.search}`, 301);
  }

  let response = NextResponse.next({ request });

  let user: { id: string } | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const path = url.pathname;
  const isApp = APP_PATHS.some((p) => path === p || path.startsWith(p + "/"));

  // Logged-in users go straight to the app; app pages need an account.
  let redirect: URL | null = null;
  if (path === "/" && user && !url.searchParams.has("home")) redirect = new URL("/dashboard", url);
  if (isApp && !user) {
    redirect = new URL("/login", url);
    redirect.searchParams.set("next", path + url.search);
  }
  if ((path === "/login" || path === "/signup") && user) redirect = new URL(url.searchParams.get("next") || "/dashboard", url);

  const out = redirect ? NextResponse.redirect(redirect) : response;
  if (redirect) response.cookies.getAll().forEach((c) => out.cookies.set(c));

  // Kwop tracked link (?k=), intended plan (?plan=) and utm_* — first-party cookies, 30 days.
  const k = url.searchParams.get("k");
  if (k && /^[A-Za-z0-9]{1,12}$/.test(k)) out.cookies.set("kwop_k", k, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });
  const plan = url.searchParams.get("plan");
  if (plan && plan.length <= 40) out.cookies.set("bdg_plan", plan, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });
  const utm: Record<string, string> = {};
  url.searchParams.forEach((v, key) => {
    if (key.startsWith("utm_") && v.length <= 100) utm[key] = v;
  });
  if (Object.keys(utm).length) out.cookies.set("bdg_src", JSON.stringify(utm), { maxAge: 60 * 60 * 24 * 30, sameSite: "lax", path: "/" });

  // Anonymous device id (for the free-try limit and to attach a try to the account at sign-up).
  // Sign-in, the app, account, checkout, API, shared results: never indexed.
  if (isPrivatePath(path)) out.headers.set("X-Robots-Tag", "noindex, nofollow");

  if (!request.cookies.get("bdg_dev")) {
    out.cookies.set("bdg_dev", crypto.randomUUID(), { maxAge: YEAR, sameSite: "lax", path: "/", httpOnly: true, secure: url.protocol === "https:" });
  }
  return out;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|manifest.webmanifest|sample-statement.pdf|robots.txt|sitemap.xml|.*\\.txt$|.*\\.(?:svg|png|jpg|jpeg|webp|ico|mp4|js|css)$).*)"],
};
