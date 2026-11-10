#!/usr/bin/env bash
# Budgeto: create the Supabase project, push the schema, deploy to Vercel and connect Kwop, in one go.
# Auth: SUPABASE_ACCESS_TOKEN / VERCEL_TOKEN env vars, or (cloud session) tokens injected by the network proxy.
# Usage: bash scripts/deploy.sh            (idempotent: re-running reuses the project and redeploys)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=.env.production.local   # gitignored: holds the production keys
touch "$OUT"
get() { grep -E "^$1=" "$OUT" 2>/dev/null | tail -1 | cut -d= -f2-; }
put() { grep -vE "^$1=" "$OUT" > "$OUT.tmp" || true; mv "$OUT.tmp" "$OUT"; echo "$1=$2" >> "$OUT"; }
SB_AUTH="Authorization: Bearer ${SUPABASE_ACCESS_TOKEN:-proxy-injected}"
VC_AUTH="Authorization: Bearer ${VERCEL_TOKEN:-proxy-injected}"
SB=https://api.supabase.com/v1
VC=https://api.vercel.com
KWOP_API=$(grep -E '^KWOP_API=' .env.local | cut -d= -f2-)
GEMINI=$(grep -E '^GEMINI_API_KEY=' .env.local | cut -d= -f2- || true)
GOOGLE=$(grep -E '^NEXT_PUBLIC_GOOGLE_ENABLED=' .env.local | cut -d= -f2- || echo 0)
json() { python3 -c "import sys,json; d=json.load(sys.stdin); print(eval(sys.argv[1]))" "$1"; }

echo "== Supabase"
REF=$(get SUPABASE_REF)
if [ -z "$REF" ]; then
  ORG=$(curl -fsS -H "$SB_AUTH" $SB/organizations | json 'd[0]["id"]')
  PASS=$(python3 -c "import secrets,string; print(''.join(secrets.choice(string.ascii_letters+string.digits) for _ in range(32)))")
  put SUPABASE_DB_PASSWORD "$PASS"
  REF=$(curl -fsS -H "$SB_AUTH" -H "Content-Type: application/json" -X POST $SB/projects \
    -d "{\"name\":\"budgeto\",\"organization_id\":\"$ORG\",\"region\":\"us-east-1\",\"db_pass\":\"$PASS\"}" | json 'd["id"]')
  put SUPABASE_REF "$REF"
fi
echo "project $REF — waiting until healthy"
for i in $(seq 1 90); do
  ST=$(curl -fsS -H "$SB_AUTH" $SB/projects/$REF | json 'd["status"]')
  [ "$ST" = "ACTIVE_HEALTHY" ] && break; sleep 10
done
KEYS=$(curl -fsS -H "$SB_AUTH" "$SB/projects/$REF/api-keys?reveal=true")
ANON=$(echo "$KEYS" | json '[k["api_key"] for k in d if k["name"]=="anon"][0]')
SERVICE=$(echo "$KEYS" | json '[k["api_key"] for k in d if k["name"]=="service_role"][0]')
put NEXT_PUBLIC_SUPABASE_URL "https://$REF.supabase.co"; put NEXT_PUBLIC_SUPABASE_ANON_KEY "$ANON"; put SUPABASE_SERVICE_ROLE_KEY "$SERVICE"
for f in supabase/migrations/*.sql; do
  echo "migration $f"
  python3 -c "import json,sys; print(json.dumps({'query': open(sys.argv[1]).read()}))" "$f" |
    curl -fsS -H "$SB_AUTH" -H "Content-Type: application/json" -X POST "$SB/projects/$REF/database/query" -d @- > /dev/null
done

echo "== Vercel"
curl -sS -H "$VC_AUTH" -H "Content-Type: application/json" -X POST $VC/v10/projects -d '{"name":"budgeto","framework":"nextjs"}' > /dev/null || true
PROJ=$(curl -fsS -H "$VC_AUTH" $VC/v9/projects/budgeto)
PID=$(echo "$PROJ" | json 'd["id"]')
DOMAIN=$(curl -fsS -H "$VC_AUTH" "$VC/v9/projects/$PID/domains" | json '[x["name"] for x in d["domains"] if x["name"].endswith(".vercel.app")][0]')
URL="https://$DOMAIN"; put NEXT_PUBLIC_SITE_URL "$URL"
setenv() { # key value type
  curl -fsS -H "$VC_AUTH" -H "Content-Type: application/json" -X POST "$VC/v10/projects/$PID/env?upsert=true" \
    -d "$(python3 -c "import json,sys; print(json.dumps({'key':sys.argv[1],'value':sys.argv[2],'type':sys.argv[3],'target':['production','preview']}))" "$1" "$2" "$3")" > /dev/null
}
setenv NEXT_PUBLIC_SITE_URL "$URL" plain
setenv NEXT_PUBLIC_SUPABASE_URL "https://$REF.supabase.co" plain
setenv NEXT_PUBLIC_SUPABASE_ANON_KEY "$ANON" plain
setenv NEXT_PUBLIC_GOOGLE_ENABLED "${GOOGLE:-0}" plain
setenv SUPABASE_SERVICE_ROLE_KEY "$SERVICE" encrypted
setenv KWOP_API "$KWOP_API" encrypted
[ -n "$GEMINI" ] && setenv GEMINI_API_KEY "$GEMINI" encrypted
setenv GEMINI_MODEL "gemini-flash-latest" plain

echo "== Supabase auth: no email confirmation, site URL $URL"
curl -fsS -H "$SB_AUTH" -H "Content-Type: application/json" -X PATCH "$SB/projects/$REF/config/auth" \
  -d "{\"mailer_autoconfirm\":true,\"site_url\":\"$URL\",\"uri_allow_list\":\"$URL/**,http://localhost:3000/**\"}" > /dev/null

echo "== Deploy"
mkdir -p .vercel
echo "{\"projectId\":\"$PID\",\"orgId\":\"$(echo "$PROJ" | json 'd["accountId"]')\"}" > .vercel/project.json
npx -y vercel@latest deploy --prod --yes --token "${VERCEL_TOKEN:-proxy-injected}" | tail -2

echo "== Kwop connect"
curl -fsS -H "Content-Type: application/json" -X POST "$KWOP_API/connect" -d "{\"url\":\"$URL\"}"; echo
echo "Budgeto is online: $URL"
