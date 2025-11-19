# 🚀 Deploy Classifieds Marketplace to AWS - Complete Beginner Guide

Deploy your own Craigslist-like marketplace on AWS for **~$10/month** (first 12 months includes FREE credits).

## 🎯 What You're Building

A full classifieds marketplace website where users can:
- ✅ Post listings with images
- ✅ Search and browse items
- ✅ Message sellers
- ✅ Save favorites
- ✅ User accounts with login

**Tech Stack:** Next.js (frontend) + FastAPI (backend) + PostgreSQL (database) + AWS S3 (images)

---

## 📋 What You Need

- GitHub account (you already have this)
- AWS account (we'll create this)
- 45 minutes of your time
- A credit card (for AWS verification - won't be charged much)

**Cost:** ~$10-15/month after free tier credits run out

---

## Part 1: Create AWS Account (10 minutes)

### Step 1: Sign Up for AWS

1. Go to: https://aws.amazon.com/
2. Click **"Create an AWS Account"** (top right)
3. Enter your email and create a password
4. Choose account type: **Personal**
5. Fill in your details (name, address, phone)
6. Enter credit card info (you'll get $300 in credits for 12 months!)
7. Verify your phone number (they'll call or text you a code)
8. Choose **"Basic Support - Free"** plan
9. Wait for account activation (usually instant, sometimes takes 24 hours)

### Step 2: Login to AWS Console

1. Go to: https://console.aws.amazon.com/
2. Sign in with your email/password
3. You should see the main AWS dashboard

**✅ AWS account ready!**

---

## Part 2: Create S3 Bucket for Images (5 minutes)

S3 is where we'll store listing photos.

### Step 1: Create Bucket

1. In AWS Console, search for **"S3"** in the top search bar
2. Click **"Create bucket"** (big orange button)
3. **Bucket name:** `marketplace-images-yourname123` (must be unique worldwide)
   - Use lowercase letters and numbers only
   - Example: `marketplace-images-john2024`
4. **Region:** Choose closest to you (example: `us-east-1` for East Coast)
5. **Block all public access:** UNCHECK this box (we need public access for images)
6. Check the warning box that says "I acknowledge..."
7. Leave everything else as default
8. Click **"Create bucket"** (bottom of page)

### Step 2: Configure CORS (so website can upload)

1. Click on your new bucket name
2. Go to **"Permissions"** tab
3. Scroll down to **"Cross-origin resource sharing (CORS)"**
4. Click **"Edit"**
5. Paste this exactly:

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

6. Click **"Save changes"**

**Write down your bucket name!** Example: `marketplace-images-john2024`

---

## Part 3: Get AWS Access Keys (5 minutes)

We need keys so the app can upload images to S3.

### Step 1: Create Access Keys

1. Click your username (top right) → **"Security credentials"**
2. Scroll down to **"Access keys"**
3. Click **"Create access key"**
4. Choose: **"Application running outside AWS"**
5. Check the box "I understand..."
6. Click **"Next"**
7. Description: `marketplace-app`
8. Click **"Create access key"**

### Step 2: SAVE YOUR KEYS!

**⚠️ CRITICAL: Save these NOW! You can't see them again!**

You'll see:
- **Access key ID:** looks like `AKIAXXXXXXXXXXXXXXXX`
- **Secret access key:** looks like long random string

**Copy both to a safe place (text file on your computer).**

Example:
```
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

Click **"Done"** when you've saved them.

---

## Part 4: Launch Your Server (15 minutes)

Time to create your virtual computer in the cloud!

### Step 1: Launch EC2 Instance

1. In AWS Console, search for **"EC2"** and click it
2. Click **"Launch instance"** (big orange button)

### Step 2: Configure Your Server

**Name your server:**
```
marketplace-server
```

**Choose operating system:**
- Click **"Ubuntu"**
- Select **"Ubuntu Server 22.04 LTS (HVM), SSD Volume Type"**
- Make sure it says **"64-bit (x86)"**

**Choose server size:**
- Select **"t3.micro"** (1 GB RAM - costs ~$7.50/month)
- If you don't see t3.micro, select **"t2.micro"** (also works, same price)

**Create login key (IMPORTANT!):**
- Click **"Create new key pair"**
- Key pair name: `marketplace-key`
- Key pair type: **RSA**
- File format:
  - **Windows users:** Choose **.ppk** if using PuTTY, or **.pem** if using PowerShell
  - **Mac/Linux users:** Choose **.pem**
- Click **"Create key pair"**
- **File will download - SAVE IT!** You can't get it again!

**Network settings (VERY IMPORTANT!):**

Click **"Edit"** next to Network settings, then:

1. Check ✅ **"Allow SSH traffic from"** → Select **"Anywhere"**
2. Check ✅ **"Allow HTTP traffic from the internet"**
3. Click **"Add security group rule"**
   - Type: **Custom TCP**
   - Port range: **80**
   - Source: **Anywhere (0.0.0.0/0)**
   - Description: `HTTP for marketplace`

**Storage:**
- Change from 8 GB to **20 GB** (you'll need space for Docker)
- Keep **gp3** selected

### Step 3: Launch!

1. Click **"Launch instance"** (orange button on right)
2. Wait for success message
3. Click **"View all instances"**
4. Wait 1-2 minutes for "Instance state" to show **"Running"** (refresh if needed)

### Step 4: Get Your Server's IP Address

1. Click the checkbox next to your instance
2. Look at details below
3. Find **"Public IPv4 address"** - looks like `54.123.45.67`
4. **COPY THIS IP!** Write it down!

Example:
```
My server IP: 54.123.45.67
```

---

## Part 5: Connect to Your Server (10 minutes)

Now let's login to your server and set it up.

### Windows Users (PowerShell)

**Step 1: Move your key file to a safe place**

```powershell
# Create .ssh folder if it doesn't exist
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh"

# Move key file
Move-Item "$env:USERPROFILE\Downloads\marketplace-key.pem" "$env:USERPROFILE\.ssh\"
```

**Step 2: Fix permissions on key file**

Right-click on the key file → Properties → Security → Advanced:
1. Click "Disable inheritance" → "Remove all inherited permissions"
2. Click "Add" → "Select a principal" → Type your Windows username → OK
3. Check "Read" permission → OK → Apply

**Or use this command:**
```powershell
icacls "$env:USERPROFILE\.ssh\marketplace-key.pem" /inheritance:r
icacls "$env:USERPROFILE\.ssh\marketplace-key.pem" /grant:r "$($env:USERNAME):(R)"
```

**Step 3: Connect!**

```powershell
# Replace YOUR_SERVER_IP with your actual IP
ssh -i "$env:USERPROFILE\.ssh\marketplace-key.pem" ubuntu@YOUR_SERVER_IP
```

Example:
```powershell
ssh -i "$env:USERPROFILE\.ssh\marketplace-key.pem" ubuntu@54.123.45.67
```

**First time:** Type `yes` when asked about fingerprint.

### Mac/Linux Users (Terminal)

**Step 1: Move key file**

```bash
# Create .ssh folder
mkdir -p ~/.ssh

# Move key from Downloads
mv ~/Downloads/marketplace-key.pem ~/.ssh/

# Fix permissions
chmod 400 ~/.ssh/marketplace-key.pem
```

**Step 2: Connect!**

```bash
# Replace YOUR_SERVER_IP with your actual IP
ssh -i ~/.ssh/marketplace-key.pem ubuntu@YOUR_SERVER_IP
```

Example:
```bash
ssh -i ~/.ssh/marketplace-key.pem ubuntu@54.123.45.67
```

**First time:** Type `yes` when asked about fingerprint.

### You Should See:

```
Welcome to Ubuntu 22.04 LTS
...
ubuntu@ip-xxx-xxx-xxx-xxx:~$
```

**✅ You're in your server!**

---

## Part 6: Install Everything (15 minutes)

Now we'll install Docker and the app. **Copy and paste these commands one at a time.**

### Step 1: Update Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
```

**Wait:** This takes 2-3 minutes. You'll see lots of text scrolling.

### Step 2: Install Docker

```bash
# Download Docker installer
curl -fsSL https://get.docker.com -o get-docker.sh

# Run installer
sudo sh get-docker.sh

# Add your user to docker group (so you don't need sudo)
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt install docker-compose -y
```

**Wait:** Takes about 3-5 minutes.

### Step 3: Install Git

```bash
sudo apt install git -y
```

### Step 4: Logout and Login Again

This is needed for Docker permissions to work.

```bash
exit
```

**Now reconnect to your server:**

Windows:
```powershell
ssh -i "$env:USERPROFILE\.ssh\marketplace-key.pem" ubuntu@YOUR_SERVER_IP
```

Mac/Linux:
```bash
ssh -i ~/.ssh/marketplace-key.pem ubuntu@YOUR_SERVER_IP
```

### Step 5: Verify Docker Works

```bash
docker --version
```

**Should show:** `Docker version 24.x.x` or similar

---

## Part 7: Download and Setup the App (10 minutes)

### Step 1: Clone the Code

```bash
# Download the marketplace code
git clone https://github.com/yourusername/your-repo.git marketplace

# Enter the folder
cd marketplace
```

**Replace `yourusername/your-repo` with your actual GitHub repository!**

**If your repo is private:**

You'll need a GitHub personal access token:
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Check "repo" permission
4. Copy the token
5. Clone with: `git clone https://YOUR_TOKEN@github.com/yourusername/your-repo.git marketplace`

### Step 2: Run Setup Script

This script will ask you questions and create the configuration file.

```bash
chmod +x setup.sh
./setup.sh
```

**You'll be asked for:**

**1. AWS Access Key ID:**
```
Enter AWS Access Key ID: AKIAXXXXXXXXXXXXXXXX
```
Paste the key you saved earlier.

**2. AWS Secret Access Key:**
```
Enter AWS Secret Access Key: [paste your secret key]
```

**3. S3 Bucket Name:**
```
Enter S3 Bucket Name: marketplace-images-yourname123
```
Use the exact bucket name you created earlier!

**4. AWS Region:**
```
Enter AWS Region (e.g., us-east-1): us-east-1
```
Use the same region where you created your S3 bucket.

**5. EC2 Public IP:**
```
Enter EC2 Public IP (or press Enter to use localhost): 54.123.45.67
```
Paste your server's IP address (the one you saved earlier).

**The script will:**
- ✅ Generate a secure database password
- ✅ Generate a secret key for security
- ✅ Create your `.env` configuration file
- ✅ Show you a summary

**You should see:**
```
✓ .env file created successfully!
✓ PostgreSQL password: [random password]
✓ API secret key: [random key]
✓ AWS S3 configured
✓ EC2 IP configured: 54.123.45.67
```

---

## Part 8: Launch Your Marketplace! (10 minutes)

### Step 1: Build Everything

This creates all the Docker containers (takes 5-10 minutes first time).

```bash
docker-compose build
```

**You'll see lots of text.** This is normal. Just wait.

**Coffee break!** ☕ This takes about 5-10 minutes.

### Step 2: Start Everything

```bash
docker-compose up -d
```

**Wait 30 seconds**, then check if it's running:

```bash
docker-compose ps
```

**You should see 4 services running:**
```
NAME                COMMAND                  STATUS
marketplace-api     "gunicorn app.main:app"  Up
marketplace-db      "postgres"               Up
marketplace-nginx   "nginx -g 'daemon of…"   Up
marketplace-web     "node server.js"         Up
```

### Step 3: Check the Logs

Make sure everything started correctly:

```bash
docker-compose logs
```

**Look for errors.** If you see mostly "INFO" messages, you're good!

### Step 4: Test It!

Open your web browser and go to:

```
http://YOUR_SERVER_IP
```

Replace `YOUR_SERVER_IP` with your actual IP!

Example: `http://54.123.45.67`

**🎉 YOU SHOULD SEE YOUR MARKETPLACE!**

---

## 🎊 What You've Done!

✅ Created AWS account
✅ Set up S3 for image storage
✅ Created AWS access keys
✅ Launched Ubuntu server (EC2)
✅ Installed Docker
✅ Configured the app
✅ Built and deployed everything
✅ Your marketplace is LIVE on the internet!

**Share your site:** `http://YOUR_SERVER_IP`

---

## 🔧 Common Commands

### View What's Running

```bash
docker-compose ps
```

### View Logs (to debug problems)

```bash
# All services
docker-compose logs

# Just the API (backend)
docker-compose logs api

# Just the web (frontend)
docker-compose logs web

# Live logs (updates in real-time)
docker-compose logs -f
```

### Restart Everything

```bash
docker-compose restart
```

### Stop Everything

```bash
docker-compose down
```

### Start Everything Again

```bash
docker-compose up -d
```

### Check Server Resources

```bash
# Check memory and CPU
free -h
df -h

# Docker stats (real-time)
docker stats
```

---

## 🔄 Updating Your App Later

When you make changes to your code:

### On Your Computer:

```bash
git add .
git commit -m "My changes"
git push
```

### On Your Server:

```bash
# SSH into server
ssh -i ~/.ssh/marketplace-key.pem ubuntu@YOUR_SERVER_IP

# Go to app folder
cd marketplace

# Get latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Check it worked
docker-compose logs
```

---

## 💰 Cost Breakdown

### Monthly AWS Costs:

| Service | Cost |
|---------|------|
| EC2 t3.micro | $7.50 |
| 20GB disk (EBS) | $1.60 |
| S3 storage (10GB images) | $0.23 |
| Data transfer | ~$1.00 |
| **TOTAL** | **~$10-15/month** |

### How to Save Money:

1. **AWS Free Tier:** New accounts get $300 credits for 12 months
2. **Stop when not using:**
   - EC2 Console → Select instance → Instance state → Stop
   - **Only pay for storage when stopped (~$1.60/month)**
3. **Monitor costs:**
   - Check: https://console.aws.amazon.com/billing/
   - Set up billing alerts!

### To Stop Your Server (save money):

```bash
# From AWS Console
EC2 → Instances → Select your instance → Instance state → Stop
```

**To start again:** Instance state → Start

**⚠️ Your IP will change when you stop/start!** You'll need to update the `.env` file with new IP.

---

## 🆘 Troubleshooting

### Can't connect to server (SSH not working)

**Problem:** Connection refused or timeout

**Check:**
1. Instance is running (not stopped) in EC2 console
2. You're using the right IP address (check EC2 console)
3. Security group has SSH (port 22) open
4. Key file permissions are correct

**Windows fix:**
```powershell
icacls "$env:USERPROFILE\.ssh\marketplace-key.pem" /inheritance:r
icacls "$env:USERPROFILE\.ssh\marketplace-key.pem" /grant:r "$($env:USERNAME):(R)"
```

**Mac/Linux fix:**
```bash
chmod 400 ~/.ssh/marketplace-key.pem
```

### Can't see website in browser

**Problem:** `http://YOUR_IP` doesn't load

**Check security group:**
1. EC2 Console → Instances → Click your instance
2. Security tab → Click security group name
3. Inbound rules → Should have:
   - SSH (22) from anywhere
   - HTTP (80) from anywhere

**If HTTP is missing:**
1. Click "Edit inbound rules"
2. "Add rule"
3. Type: HTTP
4. Source: Anywhere (0.0.0.0/0)
5. Save rules

**Check if app is running:**
```bash
docker-compose ps

# Should show 4 services "Up"
```

**Check logs for errors:**
```bash
docker-compose logs
```

### Services won't start / keep crashing

**Problem:** Docker containers stop immediately

**Most common cause:** Out of memory

**Fix:**
```bash
# Check memory
free -h

# If swap is 0, create swap file:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Restart services
cd marketplace
docker-compose down
docker-compose up -d
```

### Database errors

**Problem:** API can't connect to database

**Fix:**
```bash
# Restart database first, then API
docker-compose restart db
sleep 10
docker-compose restart api

# Check logs
docker-compose logs db
docker-compose logs api
```

### CORS errors in browser

**Problem:** Browser console shows "CORS policy" errors

**Fix:**
```bash
# Check your EC2_PUBLIC_IP in .env
cat .env | grep EC2_PUBLIC_IP

# Should match your actual server IP
# If wrong, edit it:
nano .env

# Find EC2_PUBLIC_IP line, change to your correct IP
# Press Ctrl+X, then Y, then Enter to save

# Rebuild API
docker-compose down
docker-compose up -d --build api
```

### Images won't upload

**Problem:** S3 upload errors

**Check:**
1. S3 bucket exists
2. Bucket name in `.env` matches exactly
3. AWS keys are correct
4. Bucket CORS is configured (see Part 2)

**Test AWS keys:**
```bash
# Install AWS CLI
sudo apt install awscli -y

# Test access (use your keys from .env)
export AWS_ACCESS_KEY_ID=your_key_here
export AWS_SECRET_ACCESS_KEY=your_secret_here
aws s3 ls s3://your-bucket-name

# Should list your bucket contents
```

### Out of disk space

```bash
# Check space
df -h

# Clean Docker
docker system prune -a

# WARNING: This deletes everything! You'll need to rebuild
# Say 'y' when prompted
```

### Website is slow

**Cause:** t3.micro only has 1GB RAM

**Quick fixes:**
1. Restart services: `docker-compose restart`
2. Check memory: `free -h`
3. Upgrade to t3.small (2GB RAM - $15/month):
   - EC2 Console → Instance → Actions → Instance settings → Change instance type
   - Stop instance first, then change, then start

---

## 🔒 Security Tips

### 1. Never commit secrets to GitHub!

**Check your .gitignore has:**
```
.env
*.pem
*.ppk
```

### 2. Keep server updated

```bash
# Once a week, run:
sudo apt update && sudo apt upgrade -y
```

### 3. Change default database password

The setup script generates a random password, which is good!

**To change it:**
```bash
nano .env
# Edit POSTGRES_PASSWORD line
# Save: Ctrl+X, Y, Enter

# Restart database
docker-compose down
docker-compose up -d
```

### 4. Use HTTPS later (with domain)

**Free SSL with Let's Encrypt:**

1. Get a domain name (Namecheap, GoDaddy, etc.)
2. Point A record to your server IP
3. Install certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

### 5. Backup your database

```bash
# Create backup
docker-compose exec db pg_dump -U postgres marketplace > backup.sql

# Download to your computer with scp:
# (run from your computer, not server)
scp -i ~/.ssh/marketplace-key.pem ubuntu@YOUR_SERVER_IP:~/backup.sql ./
```

---

## 📚 What Each Part Does

### Docker Containers:

1. **marketplace-web** (Next.js)
   - Your frontend website
   - What users see and click

2. **marketplace-api** (FastAPI)
   - Your backend server
   - Handles logins, listings, messages

3. **marketplace-db** (PostgreSQL)
   - Your database
   - Stores all data (users, listings, messages)

4. **marketplace-nginx**
   - Reverse proxy
   - Routes traffic between web and API
   - Handles rate limiting

### File Structure:

```
marketplace/
├── api/           ← Backend Python code
├── web/           ← Frontend Next.js code
├── nginx/         ← Proxy config
├── docker-compose.yml  ← Defines all services
├── .env           ← YOUR SECRET CONFIG (never commit!)
└── setup.sh       ← Setup script
```

---

## 🎓 Next Steps (Optional)

### Want a custom domain?

Instead of `http://54.123.45.67`, have `https://mymarketplace.com`

**Steps:**
1. Buy domain ($10-15/year): Namecheap, GoDaddy, Google Domains
2. Add A record pointing to your server IP
3. Install SSL certificate (free with Let's Encrypt)
4. Update `.env` with your domain

### Want more features?

Check these files for ideas:
- `IMPROVEMENTS.md` - Feature roadmap
- `PROJECT_SUMMARY.md` - Technical details

### Want to customize?

**Frontend (what users see):**
- Edit files in `web/app/`
- Change colors in `web/tailwind.config.js`

**Backend (API):**
- Edit files in `api/app/routers/`

**After changes:**
```bash
git add .
git commit -m "My customization"
git push

# Then on server:
ssh -i ~/.ssh/marketplace-key.pem ubuntu@YOUR_SERVER_IP
cd marketplace
git pull
docker-compose down
docker-compose build
docker-compose up -d
```

---

## ❓ FAQ

**Q: How much will this cost me?**
A: About $10-15/month. New AWS accounts get $300 credits for 12 months.

**Q: Can I use a free server?**
A: Free options (Heroku, Render, Railway) don't work well for this app - it needs 1GB RAM and PostgreSQL.

**Q: My IP changed! What do I do?**
A: When you stop/start EC2, IP changes. Update `.env` with new IP and restart: `docker-compose down && docker-compose up -d`

**Q: Can I handle more users?**
A: t3.micro handles 50-100 users. For more, upgrade to t3.small (200-300 users, ~$15/month).

**Q: How do I add more features?**
A: Edit the code, commit to GitHub, pull on server, rebuild. See "Next Steps" above.

**Q: Is my data backed up?**
A: No! You need to back it up yourself. See "Security Tips" section for backup commands.

**Q: Can I use this for a real business?**
A: Yes, but add HTTPS first (domain + SSL certificate). See "Security Tips" section.

---

## 📞 Getting Help

**Check first:**
1. Read the Troubleshooting section above
2. Check logs: `docker-compose logs`
3. Google the error message

**Still stuck?**
- Check AWS billing to make sure you're not over budget
- Check EC2 instance is running (not stopped)
- Try restarting: `docker-compose restart`

**Server commands to try:**
```bash
# Full diagnostic
docker-compose ps        # Are services running?
docker-compose logs      # What errors?
free -h                  # Enough memory?
df -h                    # Enough disk space?
```

---

## 🎉 You Did It!

You just deployed a full-stack web application to AWS! That's awesome!

**What you learned:**
- ✅ AWS (EC2, S3, IAM)
- ✅ Docker and Docker Compose
- ✅ Linux server administration
- ✅ SSH and server security
- ✅ Next.js, FastAPI, PostgreSQL
- ✅ Environment variables and secrets

**Your marketplace is live at:** `http://YOUR_SERVER_IP`

Share it with friends! 🚀

---

**Questions or problems?**
- Open an issue on GitHub
- Check AWS billing dashboard: https://console.aws.amazon.com/billing/
- Review the documentation in this repo

Good luck with your marketplace! 🎊
