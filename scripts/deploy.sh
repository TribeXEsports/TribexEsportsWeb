#!/bin/bash
# deploy.sh — TRIBEX Esports One-Command Server Deploy Script
# Run this on your Hostinger server: bash scripts/deploy.sh

set -e

echo ""
echo "=================================================="
echo "  TRIBEX ESPORTS — Auto Deploy Script             "
echo "=================================================="
echo ""

# ── Step 1: Pull latest code from GitHub ──
echo "📦  Pulling latest code from GitHub..."
git pull origin main
echo "✅  Code updated."
echo ""

# ── Step 2: Stop the old container ──
echo "🛑  Stopping current container..."
docker compose down --remove-orphans
echo "✅  Container stopped."
echo ""

# ── Step 3: Build new Docker image ──
echo "🔨  Building new Docker image (this takes ~3-5 min)..."
docker compose build --no-cache
echo "✅  Image built."
echo ""

# ── Step 4: Start new container ──
echo "🚀  Starting new container..."
docker compose up -d
echo "✅  Container started."
echo ""

# ── Step 5: Wait for health check ──
echo "⏳  Waiting for app to be ready (30s)..."
sleep 30

# ── Step 6: Verify it's running ──
STATUS=$(docker compose ps --format json | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('Health', d.get('State', 'unknown')))" 2>/dev/null || docker compose ps)
echo ""
echo "📊  Container status:"
docker compose ps
echo ""

# ── Step 7: Show recent logs ──
echo "📋  Recent logs:"
docker compose logs --tail=30
echo ""
echo "=================================================="
echo "✅  Deployment complete!"
echo "    Check your site: $(grep NEXTAUTH_URL .env | cut -d= -f2 | tr -d '\"')"
echo "=================================================="
echo ""
