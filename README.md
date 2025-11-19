# Classifieds Marketplace - POC Deployment Guide

A complete, production-ready classifieds marketplace optimized for deployment on a single AWS EC2 t3.micro instance.

## Architecture

**Containerized Monolith Stack:**
- **Frontend:** Next.js 14 (React, TypeScript, Tailwind CSS)
- **Backend:** FastAPI (Python, SQLAlchemy)
- **Database:** PostgreSQL 15
- **Reverse Proxy:** Nginx
- **Container Orchestration:** Docker Compose
- **File Storage:** AWS S3

## Prerequisites

- AWS Account with EC2 and S3 access
- Domain name (optional, for SSL)
- GitHub repository containing this code

## Deployment Steps

### 1. Create AWS S3 Bucket

```bash
aws s3 mb s3://your-marketplace-bucket-name --region us-east-1
```

Configure bucket CORS:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

### 2. Launch EC2 Instance

**Instance Specifications:**
- **Type:** t3.micro (1 vCPU, 1GB RAM)
- **OS:** Ubuntu 22.04 LTS
- **Storage:** 20GB gp3 EBS volume
- **Security Group:**
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 443 (HTTPS)

**Launch with User Data:**

```bash
#!/bin/bash
# Use the contents of user_data.sh file
```

Or manually run after launch:
```bash
chmod +x user_data.sh
sudo ./user_data.sh
```

### 3. Configure Environment Variables

SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

Clone your repository:
```bash
cd /opt
sudo git clone https://github.com/yourusername/your-repo.git marketplace
sudo chown -R ubuntu:ubuntu marketplace
cd marketplace
```

Create `.env` file from example:
```bash
cp .env.example .env
nano .env
```

Fill in your actual values:
```env
# Database
POSTGRES_PASSWORD=your_secure_random_password

# API Security
SECRET_KEY=$(openssl rand -hex 32)

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
S3_BUCKET=your-marketplace-bucket-name
AWS_REGION=us-east-1

# CORS (replace with your domain)
CORS_ORIGINS=https://yourdomain.com

# API URL (replace with your domain)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### 4. Deploy Application

Build and start containers:
```bash
docker-compose build
docker-compose up -d
```

Check status:
```bash
docker-compose ps
docker-compose logs -f
```

### 5. Configure SSL (Optional but Recommended)

Point your domain to the EC2 instance IP address (A record).

Run Certbot:
```bash
sudo certbot --nginx -d yourdomain.com
```

Update nginx configuration:
```bash
# Edit nginx/nginx.conf
# Uncomment the HTTPS server block
# Replace 'your-domain.com' with your actual domain

# Reload nginx
docker-compose restart nginx
```

## Application Management

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f db
```

### Restart Services
```bash
docker-compose restart
```

### Update Application
```bash
cd /opt/marketplace
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

### Database Backup
```bash
# Backup
docker-compose exec db pg_dump -U postgres marketplace > backup.sql

# Restore
docker-compose exec -T db psql -U postgres marketplace < backup.sql
```

### Monitor Resources
```bash
# System resources
htop
free -h
df -h

# Docker stats
docker stats
```

## API Endpoints

Base URL: `https://yourdomain.com/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get token
- `GET /auth/me` - Get current user

### Listings
- `GET /listings` - Get all listings (with filters)
- `GET /listings/{id}` - Get specific listing
- `POST /listings` - Create listing (authenticated)
- `PUT /listings/{id}` - Update listing (authenticated)
- `DELETE /listings/{id}` - Delete listing (authenticated)

### Messages
- `GET /messages` - Get user messages
- `POST /messages` - Send message (authenticated)
- `PUT /messages/{id}/read` - Mark as read

### Favorites
- `GET /favorites` - Get favorites
- `POST /favorites/{listing_id}` - Add to favorites
- `DELETE /favorites/{listing_id}` - Remove from favorites

**API Documentation:** `https://yourdomain.com/api/docs`

## Performance Optimization

### Memory Management (t3.micro)

The deployment is optimized for 1GB RAM:

1. **2GB Swap File:** Configured in user_data.sh
2. **Container Memory Limits:**
   - PostgreSQL: 256MB
   - API: 256MB
   - Web: 256MB
   - Nginx: 128MB
3. **PostgreSQL Tuning:** Optimized for low memory
4. **Gunicorn Workers:** Limited to 2 workers

### Database Indexes

The schema includes optimized indexes for:
- User lookups (email, username)
- Listing searches (category, status, location, price)
- Message queries
- Favorites

### Caching Strategies

- Nginx caching for static assets
- Docker layer caching for builds
- Next.js automatic static optimization

## Security Features

- [x] Firewall (UFW) configured
- [x] Non-root containers
- [x] SSL/TLS encryption (with Certbot)
- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] CORS protection
- [x] Rate limiting (Nginx)
- [x] Input validation (Pydantic)
- [x] SQL injection protection (SQLAlchemy ORM)
- [x] Security headers

## Cost Estimation

**Monthly AWS Costs (US-East-1):**
- EC2 t3.micro: ~$7.50
- EBS 20GB gp3: ~$1.60
- S3 Storage (10GB): ~$0.23
- Data Transfer (minimal): ~$1.00

**Total:** ~$10-15/month

## Troubleshooting

### Services Not Starting
```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -h
```

### Database Connection Issues
```bash
# Check database is running
docker-compose ps db

# Test connection
docker-compose exec db psql -U postgres -d marketplace
```

### Out of Memory
```bash
# Check swap
swapon --show

# Restart services one by one
docker-compose restart db
docker-compose restart api
docker-compose restart web
```

### SSL Certificate Issues
```bash
# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Scaling Considerations

When outgrowing t3.micro:

1. **Upgrade to t3.small** - More memory (2GB)
2. **Separate Database** - Use AWS RDS
3. **Add CloudFront** - CDN for static assets
4. **Use ECS/EKS** - Container orchestration
5. **Add Redis** - Caching layer
6. **Load Balancer** - Multiple instances

## Development

### Local Development
```bash
# Backend
cd api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd web
npm install
npm run dev
```

### Database Migrations

Using Alembic (to be configured):
```bash
cd api
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Support

For issues or questions:
1. Check application logs: `docker-compose logs`
2. Review this documentation
3. Check GitHub issues
4. Contact support

## License

MIT License - See LICENSE file for details

---

**Deployment Checklist:**
- [ ] S3 bucket created and configured
- [ ] EC2 instance launched with user_data.sh
- [ ] Repository cloned to /opt/marketplace
- [ ] .env file configured with all secrets
- [ ] Docker containers built and running
- [ ] Domain DNS configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] First user registered successfully
- [ ] First listing created successfully
- [ ] Database backup strategy in place
