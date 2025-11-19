#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "==================================================================="
echo "Marketplace Health Check"
echo "==================================================================="
echo ""

# Check Docker
echo -n "Docker daemon: "
if systemctl is-active --quiet docker; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
fi

echo ""
echo "Container Status:"
docker-compose ps

echo ""
echo "==================================================================="
echo "Service Health Checks"
echo "==================================================================="

# Check Database
echo -n "Database: "
if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Healthy${NC}"
else
    echo -e "${RED}✗ Unhealthy${NC}"
fi

# Check API
echo -n "API: "
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health 2>/dev/null)
if [ "$API_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ Healthy (HTTP 200)${NC}"
else
    echo -e "${RED}✗ Unhealthy (HTTP $API_HEALTH)${NC}"
fi

# Check Web
echo -n "Web: "
WEB_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null)
if [ "$WEB_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ Healthy (HTTP 200)${NC}"
else
    echo -e "${RED}✗ Unhealthy (HTTP $WEB_HEALTH)${NC}"
fi

# Check Nginx
echo -n "Nginx: "
NGINX_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost 2>/dev/null)
if [ "$NGINX_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ Healthy (HTTP 200)${NC}"
else
    echo -e "${RED}✗ Unhealthy (HTTP $NGINX_HEALTH)${NC}"
fi

echo ""
echo "==================================================================="
echo "System Resources"
echo "==================================================================="

# Memory
echo "Memory Usage:"
free -h

echo ""
echo "Disk Usage:"
df -h /

echo ""
echo "Swap:"
swapon --show

echo ""
echo "Container Stats:"
docker stats --no-stream

echo ""
echo "==================================================================="
echo "Recent Logs (last 20 lines)"
echo "==================================================================="
docker-compose logs --tail=20
