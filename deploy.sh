#!/bin/bash
set -e

echo "==================================================================="
echo "Marketplace Deployment Script"
echo "==================================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create .env file from .env.example"
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment file found"

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}Warning: Running as root${NC}"
fi

# Pull latest code (if git repo)
if [ -d .git ]; then
    echo "Pulling latest code from repository..."
    git pull origin main || git pull origin master || true
    echo -e "${GREEN}✓${NC} Code updated"
else
    echo -e "${YELLOW}⚠${NC} Not a git repository, skipping pull"
fi

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down
echo -e "${GREEN}✓${NC} Containers stopped"

# Build containers
echo "Building containers..."
docker-compose build --no-cache
echo -e "${GREEN}✓${NC} Containers built"

# Start services
echo "Starting services..."
docker-compose up -d
echo -e "${GREEN}✓${NC} Services started"

# Wait for services to be healthy
echo "Waiting for services to be healthy..."
sleep 10

# Check status
echo ""
echo "Service Status:"
docker-compose ps

echo ""
echo "==================================================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "==================================================================="
echo ""
echo "Next steps:"
echo "  - View logs: docker-compose logs -f"
echo "  - Check health: curl http://localhost/api/health"
echo "  - API docs: http://localhost/api/docs"
echo ""

# Show container stats
echo "Container Resource Usage:"
docker stats --no-stream

echo ""
echo -e "${GREEN}Deployment successful!${NC}"
