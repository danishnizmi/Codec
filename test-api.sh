#!/bin/bash

echo "🔍 Testing CODEC API Endpoints..."
echo ""

# Get server IP
if [ -z "$1" ]; then
    SERVER="localhost"
else
    SERVER="$1"
fi

echo "Testing server: $SERVER"
echo ""

# Test 1: Health check
echo "1️⃣ Testing health endpoint..."
curl -s "http://${SERVER}/api/health" | jq . || echo "❌ Health check failed"
echo ""

# Test 2: Root API
echo "2️⃣ Testing root API endpoint..."
curl -s "http://${SERVER}/api/" | jq . || echo "❌ Root API failed"
echo ""

# Test 3: Send verification code
echo "3️⃣ Testing send-code endpoint..."
curl -X POST "http://${SERVER}/api/auth/send-code" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  | jq . || echo "❌ Send code failed"
echo ""

echo "✅ Test complete!"
echo ""
echo "If you see errors, check:"
echo "  - Docker containers are running: docker-compose ps"
echo "  - API logs: docker-compose logs api"
echo "  - Nginx logs: docker-compose logs nginx"
