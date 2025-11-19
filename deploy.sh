#!/bin/bash
set -e  # Exit on error

echo "🚀 CODEC Deployment Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Pull latest code
echo -e "${YELLOW}📥 Step 1: Pulling latest code...${NC}"
git pull origin claude/marketplace-deployment-package-014UV2dWdHCUofSW5FAPti6J
echo -e "${GREEN}✅ Code updated${NC}"
echo ""

# Step 2: Stop containers
echo -e "${YELLOW}🛑 Step 2: Stopping containers...${NC}"
docker-compose down
echo -e "${GREEN}✅ Containers stopped${NC}"
echo ""

# Step 3: Remove Next.js build cache
echo -e "${YELLOW}🗑️  Step 3: Clearing Next.js cache...${NC}"
rm -rf web/.next
rm -rf web/node_modules/.cache
echo -e "${GREEN}✅ Cache cleared${NC}"
echo ""

# Step 4: Rebuild containers (no cache)
echo -e "${YELLOW}🔨 Step 4: Rebuilding containers (this may take 5-10 minutes)...${NC}"
docker-compose build --no-cache
echo -e "${GREEN}✅ Containers rebuilt${NC}"
echo ""

# Step 5: Start containers
echo -e "${YELLOW}🚀 Step 5: Starting containers...${NC}"
docker-compose up -d
echo -e "${GREEN}✅ Containers started${NC}"
echo ""

# Step 6: Wait for services to be ready
echo -e "${YELLOW}⏳ Step 6: Waiting for services to start (30 seconds)...${NC}"
sleep 30
echo -e "${GREEN}✅ Services should be ready${NC}"
echo ""

# Step 7: Check container status
echo -e "${YELLOW}📊 Step 7: Container status:${NC}"
docker-compose ps
echo ""

# Step 8: Test API endpoints
echo -e "${YELLOW}🧪 Step 8: Testing API endpoints...${NC}"
echo ""

# Test health endpoint
echo "Testing health check..."
if curl -s http://localhost/api/health | grep -q "healthy"; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
fi
echo ""

# Test send-code endpoint
echo "Testing send-code endpoint..."
RESPONSE=$(curl -s -X POST http://localhost/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@codec.net"}')

if echo "$RESPONSE" | grep -q "Verification code sent"; then
    echo -e "${GREEN}✅ Send-code endpoint working!${NC}"
    echo "Response: $RESPONSE"
else
    echo -e "${RED}❌ Send-code endpoint failed${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Step 9: Show recent API logs
echo -e "${YELLOW}📋 Step 9: Recent API logs (look for verification codes):${NC}"
docker-compose logs --tail=20 api
echo ""

# Done
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Open browser to: http://YOUR_EC2_IP/auth/register"
echo "2. Enter email and click 'Send Verification Code'"
echo "3. Check logs for code: docker-compose logs -f api"
echo "4. Enter the 6-digit code to login"
echo ""
echo "To monitor logs: docker-compose logs -f api"
echo "To stop: docker-compose down"
echo "To restart: docker-compose up -d"
