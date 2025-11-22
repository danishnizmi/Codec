# CyberBazaar - Build & Run Guide

Complete setup guide for the anonymous cyberpunk marketplace with AI content moderation.

---

## Prerequisites

- **Python 3.10+** (Backend)
- **Node.js 18+** and **npm** (Frontend)
- **PostgreSQL 14+** (Database)
- **AWS Account** with Bedrock access (for AI content moderation)

---

## Quick Start (Local Development)

### 1. Clone & Setup Environment

```bash
cd /home/user/Codec

# Create environment file
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` with your values:

```env
# Database Configuration
POSTGRES_DB=cyberbazaar
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/cyberbazaar

# FastAPI Backend
SECRET_KEY=generate_with_openssl_rand_hex_32
ENVIRONMENT=development

# AWS Bedrock Configuration (REQUIRED for AI moderation)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
CORS_ORIGINS=http://localhost:3000,http://localhost:4000

# S3 Configuration (Optional - for image uploads)
S3_BUCKET=your-bucket-name
```

**Generate SECRET_KEY:**
```bash
openssl rand -hex 32
```

### 3. Setup PostgreSQL Database

```bash
# Create database
createdb cyberbazaar

# Or via psql
psql -U postgres
CREATE DATABASE cyberbazaar;
\q
```

### 4. Setup Backend (FastAPI)

```bash
cd api

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migration to anonymous marketplace
python -m app.migrate_to_anonymous

# Start backend server
uvicorn app.main:app --host 0.0.0.0 --port 4000 --reload
```

Backend will be available at: **http://localhost:4000**
API docs at: **http://localhost:4000/docs**

### 5. Setup Frontend (Next.js)

Open a new terminal:

```bash
cd web

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## AWS Bedrock Setup (Required)

CyberBazaar uses AWS Bedrock **Amazon Nova Pro** for:
- **Content Moderation** - Filters harmful/illegal content
- **AI Listing Generator** - Helps users create compelling listings

### Enable Bedrock Access

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigate to **Model access** (left sidebar)
3. **Amazon Nova Pro** is automatically available (no approval needed!)
4. Just ensure your AWS credentials have Bedrock access

### Create IAM User

```bash
# Create IAM user with Bedrock permissions
aws iam create-user --user-name cyberbazaar-bedrock

# Attach policy
aws iam attach-user-policy \
  --user-name cyberbazaar-bedrock \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess

# Create access keys
aws iam create-access-key --user-name cyberbazaar-bedrock
```

Copy the Access Key ID and Secret Access Key to your `.env` file.

### Test Bedrock Connection

```bash
cd api
source venv/bin/activate
python -c "
from app.content_moderation import ContentModerationService
import os

service = ContentModerationService(
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

result = service.moderate_content(
    title='Test Listing',
    description='This is a test product description.'
)

print('✓ Amazon Nova Pro connection successful!')
print(f'Result: {result}')
"
```

**Model Used**: `us.amazon.nova-pro-v1:0` (Amazon's own model - no approval required!)

---

## Database Migration

The anonymous marketplace uses a simplified schema without users, messages, or favorites.

```bash
cd api
source venv/bin/activate

# Run migration script
python -m app.migrate_to_anonymous
```

This will:
- Drop old tables (users, messages, favorites)
- Create new anonymous listings table
- Insert cyberpunk sample data (8 listings)

**Note:** This is destructive! Backup your data first if needed.

---

## Production Build

### Frontend Build

```bash
cd web

# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Backend Production

```bash
cd api
source venv/bin/activate

# Run with Gunicorn
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:4000 \
  --timeout 120
```

---

## Docker Deployment (Optional)

If you prefer Docker:

```bash
# Build and run all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access:**
- Frontend: http://localhost (port 80)
- Backend API: http://localhost/api
- API Docs: http://localhost/api/docs

---

## Verify Installation

### Check Backend Health

```bash
curl http://localhost:4000/health
# Expected: {"status":"healthy","environment":"development"}
```

### Check Frontend

Visit: http://localhost:3000

You should see:
- Cinematic hero with "BUY. SELL. SURVIVE."
- 3D grid floor effect with film grain
- 8 sample listings with Unsplash images
- Terminal-style search input
- Category filter chips

### Test AI Features

1. **Content Moderation** (automatic):
   - Click "POST LISTING" button
   - Try creating a listing with harmful content
   - Should be rejected by AI moderator

2. **AI Listing Generator**:
   - Click "POST LISTING" button
   - Click "NEED HELP? USE AI ASSISTANT"
   - Enter item type, category, and details
   - Click "GENERATE WITH AI"
   - AI should generate title, description, price suggestions

---

## Project Structure

```
Codec/
├── api/                          # FastAPI Backend
│   ├── app/
│   │   ├── main.py              # API entry point
│   │   ├── models.py            # Database models (anonymous)
│   │   ├── content_moderation.py # AWS Bedrock integration
│   │   ├── migrate_to_anonymous.py # DB migration script
│   │   └── routers/
│   │       └── listings.py      # Listings + AI endpoints
│   ├── requirements.txt
│   └── venv/
│
├── web/                          # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx             # Homepage (cinematic hero)
│   │   ├── globals.css          # Cyberpunk styles
│   │   ├── types.ts             # TypeScript types
│   │   ├── constants.ts         # Unsplash images
│   │   └── hooks/
│   │       └── useScrollReveal.ts
│   ├── components/
│   │   ├── CyberNavbar.tsx      # Premium navbar with HUD
│   │   ├── ListingCard.tsx      # Card with slide-up overlay
│   │   ├── CreateListingModal.tsx
│   │   └── AIListingAssistant.tsx # AI generator modal
│   ├── package.json
│   └── node_modules/
│
├── .env                          # Environment variables
├── docker-compose.yml
└── CYBERBAZAAR_SETUP.md         # This file
```

---

## Features Overview

### Anonymous Marketplace
- ✅ No sign-up required
- ✅ Seller identified by handle only
- ✅ Browse without authentication
- ✅ Instant posting (after AI moderation)

### AI Content Moderation
- ✅ Automatic filtering of harmful content
- ✅ Detects: hate speech, violence, illegal items, scams, personal info
- ✅ Fail-open design (allows content if AI service unavailable)
- ✅ Returns confidence levels (HIGH/MEDIUM/LOW)

### AI Listing Generator
- ✅ Guided listing creation
- ✅ Generates cyberpunk-themed titles
- ✅ Creates compelling descriptions
- ✅ Suggests prices, conditions, locations
- ✅ Auto-fills form fields

### Cyberpunk UI/UX
- ✅ Film grain SVG overlay
- ✅ 3D perspective grid floor
- ✅ Scroll reveal animations
- ✅ Glassmorphic panels
- ✅ Terminal-style inputs with cyan glow
- ✅ HUD status indicators (connection, time, users)
- ✅ No rounded corners (clip-path polygons)
- ✅ Professional Unsplash images (30+ curated)

### Categories
- CYBERWARE (implants, augments)
- SOFTWARE (programs, data)
- HARDWARE (tech, components)
- VEHICLES (rides, transpo)
- WEAPONS (gear, defense)
- CLOTHING (armor, fashion)
- SERVICES (hacking, contracts)
- MISC (everything else)

---

## Troubleshooting

### Backend won't start

```bash
# Check Python version
python3 --version  # Should be 3.10+

# Verify database connection
psql -U postgres -d cyberbazaar -c "SELECT 1;"

# Check environment variables
cd api
source venv/bin/activate
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('DB:', os.getenv('DATABASE_URL'))"
```

### Frontend won't build

```bash
# Clear cache
cd web
rm -rf .next node_modules
npm install
npm run dev
```

### AI features not working

```bash
# Verify AWS credentials
aws sts get-caller-identity

# Check Bedrock model access
aws bedrock list-foundation-models --region us-east-1 | grep claude-3-haiku

# Test content moderation directly
cd api
source venv/bin/activate
python
>>> from app.content_moderation import ContentModerationService
>>> service = ContentModerationService(
...     aws_access_key_id="YOUR_KEY",
...     aws_secret_access_key="YOUR_SECRET"
... )
>>> result = service.moderate_content("Test", "Test description")
>>> print(result)
```

### Database migration issues

```bash
# Reset database
dropdb cyberbazaar
createdb cyberbazaar

# Re-run migration
cd api
python -m app.migrate_to_anonymous
```

### Port already in use

```bash
# Find process using port 4000
lsof -i :4000
kill -9 <PID>

# Or use different port
uvicorn app.main:app --port 4001
```

---

## Development Tips

### Hot Reload

Both services support hot reload:
- **Backend**: `--reload` flag automatically reloads on code changes
- **Frontend**: Next.js dev server automatically reloads

### API Testing

Use the interactive API docs:
- http://localhost:4000/docs (Swagger UI)
- http://localhost:4000/redoc (ReDoc)

Or use curl:
```bash
# Get all listings
curl http://localhost:4000/listings

# Create listing
curl -X POST http://localhost:4000/listings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Neural Interface v2.0",
    "description": "Military-grade neural interface with expanded bandwidth",
    "price": 12500,
    "category": "CYBERWARE",
    "seller_name": "NetRunner_X",
    "currency": "ED"
  }'

# AI Generator
curl "http://localhost:4000/listings/generate-listing?item_type=gaming%20laptop&category=HARDWARE&key_details=RTX%204090"
```

### View Logs

```bash
# Backend logs (with uvicorn)
# Already visible in terminal

# Frontend logs
# Check browser console (F12)

# Docker logs (if using Docker)
docker-compose logs -f api
docker-compose logs -f web
```

---

## Next Steps

1. **Customize Sample Data**: Edit `api/app/migrate_to_anonymous.py` to add your own listings
2. **Add More Unsplash Images**: Update `web/app/constants.ts` with more categories
3. **Configure S3**: Set up image uploads for user-submitted photos
4. **Deploy to Production**: Follow `EC2_IP_DEPLOYMENT.md` for AWS deployment
5. **Add Analytics**: Integrate PostHog, Mixpanel, or Google Analytics
6. **Set up Monitoring**: Configure error tracking with Sentry

---

## Cost Estimates

### AWS Bedrock (Amazon Nova Pro)
- **Input**: $0.0008 per 1K input tokens
- **Output**: $0.0032 per 1K output tokens
- **Typical moderation check**: ~300 input tokens + ~100 output tokens = $0.00056
- **AI listing generation**: ~200 input + ~400 output = $0.00144
- **1000 listings/day**: ~$1.70/day = ~$51/month

Very affordable for AI-powered marketplace! Plus, **no approval required** since it's Amazon's own model!

---

## Support

- **Issues**: Check `IMPROVEMENTS.md` for known issues
- **Full Documentation**: See `README.md`
- **Deployment**: See `EC2_IP_DEPLOYMENT.md`

---

**Welcome to Night City, choombatta. The streets are yours.** 🌃⚡
