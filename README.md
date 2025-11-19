# Classifieds Marketplace - Production Deployment Guide

> **Complete POC marketplace optimized for AWS EC2 t3.micro ($10-15/month)**
> Deploy a full-stack marketplace in 10 minutes using just an EC2 public IP (no domain required)

---

## 🚀 Quick Start (10 Minutes)

### What You'll Get

- ✅ Full-stack marketplace (Next.js + FastAPI + PostgreSQL)
- ✅ S3 image uploads with presigned URLs
- ✅ JWT authentication with bcrypt
- ✅ Docker containerized deployment
- ✅ Nginx reverse proxy with rate limiting
- ✅ Production-ready on 1GB RAM (t3.micro)
- ✅ Supports 50-100 concurrent users

### Prerequisites

1. AWS EC2 t3.micro instance (Ubuntu 22.04)
2. EC2 public IP address (e.g., `54.123.45.67`)
3. S3 bucket for file uploads
4. AWS access credentials
5. Security group allowing ports: **22 (SSH), 80 (HTTP)**

---

## 📋 Step-by-Step Deployment

### Step 1: Launch EC2 Instance

1. **Create t3.micro instance** with Ubuntu 22.04
2. **Configure Security Group**:
   - SSH (22): Your IP address
   - HTTP (80): 0.0.0.0/0 (public access)
3. **Optional**: Use `user_data.sh` for automated setup (installs Docker, creates swap)
4. **Note your EC2 Public IP**: e.g., `54.123.45.67`

### Step 2: Connect to EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# If you used user_data.sh, wait for it to complete (~5 minutes)
# Check progress:
tail -f /var/log/user-data.log
```

### Step 3: Clone Repository

```bash
cd /opt
sudo git clone https://github.com/yourusername/your-repo.git marketplace
sudo chown -R ubuntu:ubuntu marketplace
cd marketplace
```

### Step 4: Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

**The script will prompt you for**:

1. **AWS Credentials** (required for S3 uploads):
   ```
   Enter AWS Access Key ID: AKIAXXXXXXXXXXXXXXXX
   Enter AWS Secret Access Key: ********
   Enter S3 Bucket Name: my-marketplace-bucket
   ```

2. **EC2 Public IP** (for CORS and API configuration):
   ```
   Enter EC2 Public IP: 54.123.45.67
   ```

The script automatically:
- ✅ Generates secure PostgreSQL password
- ✅ Generates API secret key (JWT)
- ✅ Configures AWS S3 settings
- ✅ Sets up CORS for your EC2 IP
- ✅ Configures frontend API URL

### Step 5: Start Services

```bash
docker-compose up -d

# Wait ~30 seconds for services to initialize
docker-compose ps
```

**Expected output**:
```
NAME                COMMAND                  STATUS              PORTS
marketplace-api     "gunicorn app.main:app"  Up 30 seconds       4000/tcp
marketplace-db      "postgres"               Up 30 seconds       5432/tcp
marketplace-nginx   "nginx -g 'daemon of…"   Up 30 seconds       0.0.0.0:80->80/tcp
marketplace-web     "node server.js"         Up 30 seconds       3000/tcp
```

### Step 6: Verify Deployment

```bash
# Run health check script
chmod +x health-check.sh
./health-check.sh

# Or manually test:
curl http://YOUR_EC2_IP/api/health
# Expected: {"status":"healthy","environment":"production"}

curl -I http://YOUR_EC2_IP
# Expected: HTTP/1.1 200 OK
```

### Step 7: Access Your Marketplace

Open in browser:
```
http://YOUR_EC2_IP
```

🎉 **You should see your marketplace homepage!**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    AWS EC2 t3.micro (1GB RAM)           │
│                                                           │
│  ┌─────────────┐                                        │
│  │   Nginx     │ ◄── HTTP :80 (public)                 │
│  │  (128MB)    │                                        │
│  └──────┬──────┘                                        │
│         │                                                │
│    ┌────┴─────────┐                                     │
│    │              │                                      │
│  ┌─▼──────┐  ┌───▼──────┐                              │
│  │ Next.js│  │ FastAPI  │                              │
│  │ Web    │  │ API      │                              │
│  │(256MB) │  │ (256MB)  │                              │
│  └────────┘  └────┬─────┘                              │
│                    │                                     │
│              ┌─────▼─────┐                              │
│              │PostgreSQL │                              │
│              │  (256MB)  │                              │
│              └───────────┘                              │
│                                                           │
│  System: ~104MB | Swap: 2GB                             │
└─────────────────────────────────────────────────────────┘
                         │
                         │ S3 Uploads
                         ▼
                 ┌──────────────┐
                 │   AWS S3     │
                 │ (Image Files)│
                 └──────────────┘
```

### Technology Stack

- **Frontend**: Next.js 14 with App Router & React Server Components
- **Backend**: FastAPI with async Uvicorn worker
- **Database**: PostgreSQL 15 Alpine
- **Proxy**: Nginx with rate limiting
- **Storage**: AWS S3 with presigned POST URLs
- **Auth**: JWT tokens with bcrypt hashing
- **Containerization**: Docker Compose

---

## ⚙️ Configuration Details

### Generated .env File

After running `./setup.sh`, your `.env` contains:

```bash
# Database
POSTGRES_PASSWORD=<auto-generated-secure-password>
DATABASE_URL=postgresql://postgres:<password>@db:5432/marketplace

# API Security
SECRET_KEY=<auto-generated-64-char-hex>

# AWS S3
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=********
S3_BUCKET=my-marketplace-bucket
AWS_REGION=us-east-1

# EC2 Deployment
EC2_PUBLIC_IP=54.123.45.67

# CORS (automatically includes your IP)
CORS_ORIGINS=http://localhost:3000,http://54.123.45.67

# Frontend API URL
NEXT_PUBLIC_API_URL=http://54.123.45.67/api

# Internal API URL (Docker network)
INTERNAL_API_URL=http://api:4000

# Environment
ENVIRONMENT=production
```

### Automatic CORS Configuration

The FastAPI backend automatically adds your EC2 IP to CORS origins:

```python
@property
def cors_origins_list(self) -> List[str]:
    origins = [origin.strip() for origin in self.CORS_ORIGINS.split(',')]

    # Auto-add EC2 IP to CORS if configured
    if self.EC2_PUBLIC_IP and self.EC2_PUBLIC_IP != "YOUR_EC2_IP":
        ec2_origin = f"http://{self.EC2_PUBLIC_IP}"
        if ec2_origin not in origins:
            origins.append(ec2_origin)

    return origins
```

**Benefits**:
- ✅ No manual CORS configuration
- ✅ Works with IP changes (just update .env)
- ✅ Localhost still works for local testing

---

## 🧪 Testing Your Deployment

### 1. API Health Check
```bash
curl http://YOUR_EC2_IP/api/health
# Expected: {"status":"healthy","environment":"production"}
```

### 2. API Documentation (Development Mode)
```bash
# If ENVIRONMENT=development in .env:
open http://YOUR_EC2_IP/api/docs
```

### 3. Frontend Homepage
```bash
curl -I http://YOUR_EC2_IP
# Expected: HTTP/1.1 200 OK

# In browser:
open http://YOUR_EC2_IP
```

### 4. Listings Page (Server-Side Rendering)
```bash
curl -I http://YOUR_EC2_IP/listings
# Expected: HTTP/1.1 200 OK with rendered HTML
```

### 5. S3 Upload Endpoint (Requires Auth)
```bash
curl -X POST http://YOUR_EC2_IP/api/listings/upload-urls?file_count=1
# Expected: 401 Unauthorized (correct - requires login)
```

---

## 🐛 Troubleshooting

### Issue 1: Cannot Access via IP

**Symptoms**: Browser shows "This site can't be reached"

**Solutions**:
```bash
# 1. Check EC2 security group allows port 80 from 0.0.0.0/0

# 2. Check services are running
docker-compose ps

# 3. Check nginx is accessible locally
curl localhost
# If this works but IP doesn't → security group issue

# 4. Check nginx logs
docker-compose logs nginx
```

### Issue 2: CORS Errors in Browser Console

**Symptoms**:
```
Access to XMLHttpRequest at 'http://54.123.45.67/api/...' blocked by CORS policy
```

**Solutions**:
```bash
# 1. Verify EC2_PUBLIC_IP in .env
cat .env | grep EC2_PUBLIC_IP
# Should show: EC2_PUBLIC_IP=54.123.45.67

# 2. Verify CORS_ORIGINS includes your IP
cat .env | grep CORS_ORIGINS
# Should include: http://54.123.45.67

# 3. Rebuild API container
docker-compose down
docker-compose up -d --build api

# 4. Check CORS in logs
docker-compose logs api | grep -i cors
```

### Issue 3: 502 Bad Gateway

**Symptoms**: Nginx returns 502 error

**Solutions**:
```bash
# 1. Check API is running
docker-compose ps api

# 2. Check API logs
docker-compose logs api

# 3. Check API health directly
docker-compose exec api curl localhost:4000/health

# 4. Restart services
docker-compose restart api
docker-compose restart nginx
```

### Issue 4: Out of Memory / Services Crashing

**Symptoms**: Services randomly stopping, high swap usage

**Solutions**:
```bash
# 1. Check memory usage
free -h
docker stats --no-stream

# 2. Verify swap is active
swapon --show
# Should show 2GB swap file

# 3. Restart services one by one
docker-compose restart db
sleep 10
docker-compose restart api
sleep 5
docker-compose restart web
docker-compose restart nginx

# 4. If persistent, check logs
docker-compose logs --tail=100
```

### Issue 5: Database Connection Failed

**Symptoms**: API logs show "could not connect to database"

**Solutions**:
```bash
# 1. Check database is running
docker-compose ps db

# 2. Check database logs
docker-compose logs db

# 3. Verify DATABASE_URL in .env matches POSTGRES_PASSWORD

# 4. Restart database
docker-compose restart db
sleep 10
docker-compose restart api
```

---

## 📊 Performance Expectations

On t3.micro (1GB RAM + 2GB swap):

| Metric | Expected Value |
|--------|----------------|
| **Concurrent Users** | 50-100 |
| **API Response Time** | 50-100ms |
| **Page Load Time** | 1-2s (first load) |
| **Memory Usage** | ~900MB / 1GB |
| **Swap Usage** | <500MB normal |
| **Throughput** | ~150-250 req/s |

### Load Testing

```bash
# Install hey (load testing tool)
go install github.com/rakyll/hey@latest

# Test API endpoint
hey -n 100 -c 10 http://YOUR_EC2_IP/api/listings

# Expected: ~150-250 req/s
```

---

## 🔒 Security Notes

⚠️ **Important**: This deployment uses HTTP (port 80) without encryption

**What this means**:
- ✅ Fine for POC and early testing
- ✅ Safe on private networks
- ❌ **NOT recommended for production with real users**
- ❌ NOT safe for sensitive data
- ❌ Passwords transmitted in plain text

**Recommendations**:
1. ✅ Use HTTPS with Let's Encrypt (free) before collecting user data
2. ✅ Don't process payments without SSL
3. ✅ Use strong passwords even on HTTP
4. ✅ Plan to upgrade to domain + SSL soon (see below)

---

## 🚀 Upgrading to Domain + SSL

When ready for production with a real domain:

### Step 1: Point Domain to EC2

```bash
# Create A record in your DNS provider:
yourdomain.com → 54.123.45.67
```

### Step 2: Update .env

```bash
nano .env

# Update these values:
EC2_PUBLIC_IP=yourdomain.com
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### Step 3: Install SSL Certificate

```bash
# Install certbot (if not already installed)
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Certbot will automatically:
# - Generate SSL certificate
# - Update nginx configuration
# - Set up auto-renewal
```

### Step 4: Update nginx.conf for HTTPS

```bash
nano nginx/nginx.conf

# In the HTTP server block (line 82-84), uncomment:
location / {
    return 301 https://$host$request_uri;
}

# Uncomment the entire HTTPS server block (lines 133-207)
# Update server_name to your domain
```

### Step 5: Restart Services

```bash
docker-compose down
docker-compose up -d

# Test HTTPS
curl https://yourdomain.com/api/health
```

### Step 6: Update Security Group

```bash
# Add HTTPS rule to EC2 security group:
HTTPS (443): 0.0.0.0/0
```

---

## 🛠️ Common Operations

### View Service Status
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f nginx
docker-compose logs -f db
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart api
```

### Stop Services
```bash
docker-compose down
```

### Start Services
```bash
docker-compose up -d
```

### Update Application
```bash
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

### Database Backup
```bash
# Create backup
docker-compose exec db pg_dump -U postgres marketplace > backup-$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T db psql -U postgres marketplace < backup-20240101.sql
```

### Monitor Resources
```bash
# System resources
free -h
df -h

# Docker stats
docker stats

# Detailed health check
./health-check.sh
```

---

## 💰 Cost Estimation

**Monthly Cost**: ~$10-15

| Service | Cost |
|---------|------|
| EC2 t3.micro | $7.50 |
| EBS 20GB (gp3) | $1.60 |
| S3 Storage (10GB) | $0.23 |
| Data Transfer | ~$1.00 |

**Cost Optimization Tips**:
- Use S3 lifecycle policies for old images
- Enable EBS gp3 (cheaper than gp2)
- Stop instance when not in use (dev/test)
- Use CloudWatch alarms for spend monitoring
- Reserved Instances (1-year) save ~30%

---

## 📁 Project Structure

```
marketplace/
├── api/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py        # FastAPI app with middleware
│   │   ├── config.py      # Settings with dynamic CORS
│   │   ├── database.py    # PostgreSQL connection
│   │   ├── models.py      # SQLAlchemy models
│   │   ├── schemas.py     # Pydantic schemas
│   │   └── routers/       # API endpoints
│   │       ├── auth.py    # JWT authentication
│   │       ├── listings.py # Listings + S3 uploads
│   │       ├── messages.py
│   │       └── favorites.py
│   ├── Dockerfile.prod    # Production build (1 worker)
│   └── requirements.txt
│
├── web/                    # Next.js frontend
│   ├── app/
│   │   ├── layout.js      # Root layout
│   │   ├── page.js        # Homepage
│   │   └── listings/
│   │       ├── page.js    # Server Component (RSC)
│   │       └── listings-client.js
│   ├── lib/
│   │   ├── api.ts         # API client
│   │   └── s3-upload.ts   # S3 presigned POST
│   ├── Dockerfile.prod    # Alpine build (150MB)
│   ├── package.json
│   └── next.config.js
│
├── nginx/
│   └── nginx.conf         # Reverse proxy (IP + SSL ready)
│
├── docker-compose.yml     # Service orchestration
├── .env.example           # Environment template
├── setup.sh               # Interactive setup script
├── health-check.sh        # System health check
├── user_data.sh           # EC2 initialization
├── schema.prisma          # Database schema
└── README.md              # This file
```

---

## 🔧 Memory Optimization Details

### Container Limits

| Container | Memory Limit | Notes |
|-----------|--------------|-------|
| PostgreSQL | 256MB | 64MB shared_buffers, 20 max_connections |
| API | 256MB | 1 Gunicorn worker (async) |
| Next.js | 256MB | Standalone output |
| Nginx | 128MB | Reverse proxy + rate limiting |
| **Total** | **896MB** | Fits in 1GB with headroom |

### Key Optimizations

1. **Single Gunicorn Worker**: One async Uvicorn worker handles concurrency without OOM risk
2. **PostgreSQL Tuning**: Reduced connections (20) and buffer sizes (64MB) for memory efficiency
3. **2GB Swap File**: Provides safety buffer for memory spikes
4. **Alpine Images**: Minimal base images reduce size by 40%
5. **Next.js Standalone**: Optimized production build (~150MB)

---

## 📚 Additional Documentation

- **EC2_IP_DEPLOYMENT.md**: Detailed IP-based deployment guide
- **IMPROVEMENTS.md**: Production improvements and optimizations
- **PROJECT_SUMMARY.md**: Technical architecture overview
- **QUICKSTART.md**: Alternative quick start guide

---

## ❓ FAQ

### Q: Can I use a domain instead of an IP?
**A:** Yes! Follow the "Upgrading to Domain + SSL" section above.

### Q: How do I enable HTTPS?
**A:** Install Let's Encrypt SSL certificate using certbot (see upgrade section).

### Q: What if I need more resources?
**A:** Upgrade to t3.small (2GB RAM) for 200-300 concurrent users. Update memory limits in docker-compose.yml proportionally.

### Q: Can I use RDS instead of containerized PostgreSQL?
**A:** Yes, update DATABASE_URL in .env to point to RDS endpoint. Remove db service from docker-compose.yml.

### Q: How do I add more features?
**A:** This is a POC. See IMPROVEMENTS.md for roadmap (WebSockets, Redis, payments, etc.).

### Q: What about backups?
**A:** Use the database backup commands above. Consider AWS Backup for automated EBS snapshots.

---

## 🚨 Important Reminders

1. ✅ **Change default passwords** - setup.sh generates secure ones
2. ✅ **Update security groups** - Only open necessary ports
3. ✅ **Enable HTTPS before production** - Required for sensitive data
4. ✅ **Set up backups** - Regular database and EBS snapshots
5. ✅ **Monitor costs** - Use AWS Cost Explorer
6. ✅ **Update regularly** - `git pull && docker-compose up -d --build`

---

## 📞 Support

**Having Issues?**

1. Run health check: `./health-check.sh`
2. Check logs: `docker-compose logs -f`
3. Review troubleshooting section above
4. Check `.env` configuration
5. Verify security group settings

**Debug Commands**:
```bash
# Full diagnostic
./health-check.sh

# Check environment
cat .env | grep -v PASSWORD | grep -v SECRET

# Memory check
free -h && docker stats --no-stream

# Service status
docker-compose ps

# Recent errors
docker-compose logs --tail=50 | grep -i error
```

---

## 📄 License

This project is provided as-is for POC and educational purposes.

---

## ✅ Deployment Checklist

Before going live:

- [ ] EC2 instance launched with Ubuntu 22.04
- [ ] Security group configured (ports 22, 80)
- [ ] S3 bucket created with correct permissions
- [ ] AWS credentials configured
- [ ] `setup.sh` completed successfully
- [ ] `.env` file created with correct values
- [ ] Services started with `docker-compose up -d`
- [ ] Health check passing: `./health-check.sh`
- [ ] Website accessible at `http://YOUR_EC2_IP`
- [ ] API responding at `http://YOUR_EC2_IP/api/health`
- [ ] 2GB swap file active: `swapon --show`
- [ ] Backups configured (optional but recommended)

**For Production**:
- [ ] Domain pointed to EC2 IP
- [ ] SSL certificate installed with certbot
- [ ] HTTPS enabled and working
- [ ] HTTP → HTTPS redirect active
- [ ] Security group updated (port 443)
- [ ] Monitoring set up (CloudWatch/Uptime)
- [ ] Backup strategy implemented

---

**Status**: ✅ Production-ready for POC/early-stage deployment
**Version**: 1.1.3 - IP Deployment Support
**Cost**: ~$10-15/month
**Capacity**: 50-100 concurrent users on t3.micro

**Happy deploying! 🚀**
