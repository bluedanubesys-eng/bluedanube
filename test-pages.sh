#!/usr/bin/env bash
set -e

BASE="http://localhost:3000"

echo "Starting Next.js server..."
npm run dev > /tmp/bluedanube-dev.log 2>&1 &
PID=$!

sleep 5

echo "Testing pages..."

pages=(
  "/"
  "/shop"
  "/cart"
  "/checkout"
  "/account"
  "/partner"
  "/partner/dashboard"
  "/login"
  "/verify"
  "/admin/dashboard"
  "/admin/products"
  "/admin/customers"
  "/admin/orders"
  "/admin/payments"
  "/admin/partners"
  "/admin/expenses"
  "/admin/reports"
  "/admin/settings"
  "/admin/users"
  "/admin/documents"
  "/admin/notifications"
  "/admin/activity-logs"
  "/admin/audit-logs"
  "/admin/analytics"
  "/admin/coupons"
  "/admin/reviews"
)

FAILED=0

for page in "${pages[@]}"; do
  STATUS=$(curl -s -o /tmp/page.html -w "%{http_code}" "$BASE$page" || true)

  if [ "$STATUS" = "200" ] || [ "$STATUS" = "307" ] || [ "$STATUS" = "308" ]; then
    echo "✅ $page -> $STATUS"
  else
    echo "❌ $page -> $STATUS"
    FAILED=$((FAILED+1))
  fi
done

echo "Stopping server..."
kill $PID || true

echo "================================"
if [ "$FAILED" -eq 0 ]; then
  echo "✅ ALL ROUTES PASSED"
else
  echo "❌ FAILED ROUTES: $FAILED"
fi
echo "================================"
