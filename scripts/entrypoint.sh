#!/bin/sh
# entrypoint.sh — TRIBEX Esports Auto-Deploy Entrypoint
set -e

echo ""
echo "=================================================="
echo "  TRIBEX ESPORTS — Production Container Starting  "
echo "=================================================="
echo ""

# ── Step 1: Validate required environment variables ──
MISSING=""
[ -z "$DATABASE_URL" ]    && MISSING="$MISSING DATABASE_URL"
[ -z "$NEXTAUTH_SECRET" ] && MISSING="$MISSING NEXTAUTH_SECRET"
[ -z "$NEXTAUTH_URL" ]    && MISSING="$MISSING NEXTAUTH_URL"

if [ -n "$MISSING" ]; then
  echo "❌  FATAL: Missing required environment variables:$MISSING"
  echo "    Add them to your .env file and restart the container."
  exit 1
fi

echo "✅  Environment variables validated."

# ── Step 2: Apply Prisma schema to database ──
echo "🗄️   Running Prisma DB push..."
if npx prisma@6.2.1 db push --accept-data-loss --skip-generate; then
  echo "✅  Database schema is up to date."
else
  echo "⚠️   Prisma DB push failed — continuing anyway (DB may already be in sync)."
fi

# ── Step 3: Start the application ──
echo ""
echo "🚀  Starting TRIBEX application on port ${PORT:-3000}..."
echo "    URL: ${NEXTAUTH_URL}"
echo "=================================================="
echo ""

exec "$@"
