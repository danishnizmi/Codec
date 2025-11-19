# Quick Start Guide

Get your marketplace running in 10 minutes!

## Prerequisites

- AWS account
- SSH client
- Domain name (optional)

## Step 1: Create S3 Bucket (2 minutes)

```bash
aws s3 mb s3://my-marketplace-bucket
```

## Step 2: Launch EC2 Instance (3 minutes)

1. Go to AWS EC2 Console
2. Click "Launch Instance"
3. Choose **Ubuntu 22.04 LTS**
4. Select **t3.micro**
5. Configure Security Group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
6. In "Advanced Details" > "User data", paste contents of `user_data.sh`
7. Launch and wait ~5 minutes for setup

## Step 3: Deploy Application (5 minutes)

SSH into instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Setup application:
```bash
# Clone repository
cd /opt
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git marketplace
sudo chown -R ubuntu:ubuntu marketplace
cd marketplace

# Configure environment
cp .env.example .env
nano .env  # Fill in your values

# Generate secret key
openssl rand -hex 32

# Deploy
docker-compose up -d

# Check status
docker-compose ps
```

## Step 4: Test (1 minute)

Visit `http://your-ec2-ip` in browser!

## Environment Variables Quick Reference

```env
# Required
POSTGRES_PASSWORD=random_secure_password
SECRET_KEY=output_from_openssl_command_above
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=my-marketplace-bucket

# Optional (use defaults)
POSTGRES_DB=marketplace
POSTGRES_USER=postgres
AWS_REGION=us-east-1
CORS_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://your-ec2-ip/api
```

## Common Commands

```bash
# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Stop
docker-compose down

# Update code
git pull && docker-compose up -d --build

# Database backup
docker-compose exec db pg_dump -U postgres marketplace > backup.sql
```

## Add SSL (Optional)

```bash
# Point domain to EC2 IP
# Then run:
sudo certbot --nginx -d yourdomain.com

# Update .env
CORS_ORIGINS=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Restart
docker-compose restart
```

## Troubleshooting

**Services won't start?**
```bash
# Check memory
free -h

# Verify swap
swapon --show

# Check logs
docker-compose logs
```

**Can't connect?**
- Check EC2 security group allows ports 80/443
- Verify instance is running
- Check docker containers: `docker-compose ps`

**Out of memory?**
```bash
# Restart services sequentially
docker-compose restart db
sleep 10
docker-compose restart api
sleep 5
docker-compose restart web
```

## Next Steps

1. Register your first user: `http://your-ip/auth/register`
2. Create a listing
3. Test messaging
4. Configure S3 for image uploads
5. Add your domain and SSL
6. Set up monitoring

## API Documentation

Visit: `http://your-ip/api/docs`

## Support

Check the full [README.md](README.md) for detailed documentation.

---

**That's it! Your marketplace is live!** 🎉
