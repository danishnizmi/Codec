#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "==================================================================="
echo "Marketplace Setup Script"
echo "==================================================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}Warning: .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy .env.example to .env
echo -e "${GREEN}Creating .env file from template...${NC}"
cp .env.example .env

# Generate secure random password
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
echo -e "${GREEN}✓${NC} Generated secure PostgreSQL password"

# Generate secret key
SECRET_KEY=$(openssl rand -hex 32)
echo -e "${GREEN}✓${NC} Generated API secret key"

# Update .env file with generated values
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/your_secure_postgres_password_here/$POSTGRES_PASSWORD/g" .env
    sed -i '' "s/your_secret_key_here_min_32_characters_long_random_string/$SECRET_KEY/g" .env
else
    # Linux
    sed -i "s/your_secure_postgres_password_here/$POSTGRES_PASSWORD/g" .env
    sed -i "s/your_secret_key_here_min_32_characters_long_random_string/$SECRET_KEY/g" .env
fi

echo -e "${GREEN}✓${NC} Updated .env file with secure credentials"
echo ""

# Prompt for AWS credentials
echo "AWS Configuration (required for S3 file uploads)"
echo "You can skip this now and add it manually later to .env"
echo ""

read -p "Enter AWS Access Key ID (or press Enter to skip): " AWS_KEY
if [ ! -z "$AWS_KEY" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your_aws_access_key_id/$AWS_KEY/g" .env
    else
        sed -i "s/your_aws_access_key_id/$AWS_KEY/g" .env
    fi

    read -p "Enter AWS Secret Access Key: " AWS_SECRET
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your_aws_secret_access_key/$AWS_SECRET/g" .env
    else
        sed -i "s/your_aws_secret_access_key/$AWS_SECRET/g" .env
    fi

    read -p "Enter S3 Bucket Name: " S3_BUCKET
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your-marketplace-bucket-name/$S3_BUCKET/g" .env
    else
        sed -i "s/your-marketplace-bucket-name/$S3_BUCKET/g" .env
    fi

    echo -e "${GREEN}✓${NC} AWS credentials configured"
fi

echo ""
echo "==================================================================="
echo "EC2 Deployment Configuration"
echo "==================================================================="
echo ""
echo "If deploying to AWS EC2, enter your public IP address."
echo "This will configure CORS and frontend API URL automatically."
echo "Example: 54.123.45.67"
echo ""

read -p "Enter EC2 Public IP (or press Enter to use localhost): " EC2_IP
if [ ! -z "$EC2_IP" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/YOUR_EC2_IP/$EC2_IP/g" .env
    else
        sed -i "s/YOUR_EC2_IP/$EC2_IP/g" .env
    fi

    echo -e "${GREEN}✓${NC} EC2 IP configured: $EC2_IP"
    echo "   CORS will allow: http://$EC2_IP"
    echo "   Frontend API URL: http://$EC2_IP/api"
else
    echo -e "${YELLOW}⚠${NC} Using localhost configuration"
    echo "   To configure EC2 IP later, edit .env and replace YOUR_EC2_IP"
fi

echo ""
echo "==================================================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "==================================================================="
echo ""
echo "Your .env file has been created with:"
echo "  - Secure PostgreSQL password"
echo "  - Secure API secret key"
echo "  - AWS credentials (if provided)"
echo "  - EC2 IP address (if provided)"
echo ""
echo "Next steps:"
echo "  1. Review and customize .env if needed"
echo "  2. Run: docker-compose up -d"
if [ ! -z "$EC2_IP" ]; then
    echo "  3. Access at http://$EC2_IP"
else
    echo "  3. Access at http://localhost"
fi
echo ""
echo "For production with domain and SSL:"
echo "  1. Point your domain to EC2 instance"
echo "  2. Update .env with your domain (replace EC2 IP)"
echo "  3. Run: sudo certbot --nginx -d yourdomain.com"
echo "  4. Update CORS_ORIGINS and NEXT_PUBLIC_API_URL to use https://"
echo ""
echo "Run './health-check.sh' to verify the deployment"
echo ""
