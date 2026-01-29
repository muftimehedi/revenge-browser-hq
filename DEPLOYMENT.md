# Google Cloud CI/CD Setup Guide

## Overview

This project uses GitHub Actions to automatically deploy to Google Cloud Run:
- **dev-release branch** → `dev.revenge-x-hq.com`
- **main branch** → `revenge-x-hq.com`

---

## Prerequisites

### 1. Google Cloud Setup

```bash
# Install gcloud CLI
# macOS
brew install google-cloud-sdk

# Initialize gcloud
gcloud init

# Enable required APIs
gcloud services enable \
  artifactregistry.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

### 2. Create Resources

```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Create Artifact Registry
gcloud artifacts repositories create revenge-x-hq \
  --repository-format=docker \
  --location=us \
  --description="Docker repository for Revenge X HQ"

# Create Cloud SQL (PostgreSQL)
# Dev
gcloud sql instances create revenge-x-hq-dev-db \
  --database-version=POSTGRES_18 \
  --tier=db-f1-micro \
  --region=us-central1

# Production
gcloud sql instances create revenge-x-hq-prod-db \
  --database-version=POSTGRES_18 \
  --tier=db-custom-2-7680 \
  --region=us-central1 \
  --availability-type=REGIONAL

# Create databases
gcloud sql databases create revenge_x_hq_dev --instance=revenge-x-hq-dev-db
gcloud sql databases create revenge_x_hq_prod --instance=revenge-x-hq-prod-db

# Create Cloud Storage buckets
gsutil mb -p $PROJECT_ID gs://revenge-x-hq-dev-apk
gsutil mb -p $PROJECT_ID gs://revenge-x-hq-prod-apk
```

---

## GitHub Secrets Configuration

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

### Required Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `GCP_PROJECT_ID` | Google Cloud project ID | `my-project-123` |
| `GCP_SA_KEY` | Service account key (base64) | `ewogICJ0eXBlIjog...` |
| `GCP_ARTIFACT_REPO` | Artifact repository name | `revenge-browser` |

### Dev Environment Secrets

| Secret Name | Description |
|------------|-------------|
| `DEV_APP_URL` | `https://dev.revenge-x-hq.com` |
| `DEV_DB_HOST` | Cloud SQL connection name |
| `DEV_DB_DATABASE` | `revenge_x_hq_dev` |
| `DEV_DB_USERNAME` | Database username |
| `DEV_DB_PASSWORD` | Database password |
| `DEV_REDIS_HOST` | Redis instance IP |
| `DEV_REDIS_PASSWORD` | Redis password |
| `DEV_APP_KEY` | Laravel APP_KEY (base64) |
| `DEV_STORAGE_BUCKET` | `revenge-x-hq-dev-apk` |

### Production Secrets

| Secret Name | Description |
|------------|-------------|
| `PROD_APP_URL` | `https://revenge-x-hq.com` |
| `PROD_DB_HOST` | Cloud SQL connection name |
| `PROD_DB_DATABASE` | `revenge_x_hq_prod` |
| `PROD_DB_USERNAME` | Database username |
| `PROD_DB_PASSWORD` | Database password |
| `PROD_REDIS_HOST` | Redis instance IP |
| `PROD_REDIS_PASSWORD` | Redis password |
| `PROD_APP_KEY` | Laravel APP_KEY (base64) |
| `PROD_STORAGE_BUCKET` | `revenge-x-hq-prod-apk` |

---

## Service Account Setup

Create a service account for GitHub Actions:

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer"

# Add roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Create and download key
gcloud iam service-accounts keys create gcp-sa-key.json \
  --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com

# Convert to base64 for GitHub Secret
cat gcp-sa-key.json | base64 -w 0
```

---

## Generate APP_KEY

```bash
# Generate Laravel APP_KEY
php artisan key:generate --show

# Use the output for DEV_APP_KEY and PROD_APP_KEY
```

---

## Domain Setup

### 1. Verify Domain Ownership

```bash
# Go to Google Cloud Console
# Compute > Cloud Run > Domain mappings
# Add and verify your domains
```

### 2. Create Domain Mappings

```bash
# Dev
gcloud run domain-mappings create \
  --domain=dev.revenge-x-hq.com \
  --service=revenge-x-hq-dev \
  --region=us-central1

# Production
gcloud run domain-mappings create \
  --domain=revenge-x-hq.com \
  --service=revenge-x-hq-prod \
  --region=us-central1
```

### 3. DNS Configuration

Add these records to your DNS:

| Type | Name | Value |
|------|------|-------|
| CNAME | dev | `ghs.googlehosted.com` |
| CNAME | @ | `ghs.googlehosted.com` |

---

## Deployment Workflow

### Automatic Deployment (CI/CD)

1. Push to `dev-release` → Auto deploys to dev
2. Push to `main` → Auto deploys to production (with canary)

### Manual Deployment

```bash
# Deploy to dev
./scripts/deploy-gcp.sh dev

# Deploy to production
./scripts/deploy-gcp.sh prod
```

---

## Initial Database Setup

After first deployment, run migrations:

```bash
# Using Cloud SQL Proxy
gcloud sql connect revenge-x-hq-dev-db --user=postgres

# Or via Cloud Shell
gcloud cloud-shell ssh

# Run migrations
php artisan migrate --force
php artisan db:seed --force
```

---

## Health Check

After deployment, verify:

```bash
# Dev
curl https://dev.revenge-x-hq.com/api/health

# Production
curl https://revenge-x-hq.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-29T00:00:00.000000Z",
  "version": "1.0.0"
}
```

---

## Environment Variables Reference

### Required for Cloud Run

```bash
# Application
APP_NAME="Revenge X HQ"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://revenge-x-hq.com

# Database (Cloud SQL)
DB_CONNECTION=pgsql
DB_HOST=/cloudsql/PROJECT:REGION:INSTANCE
DB_PORT=5432
DB_DATABASE=revenge_x_hq_prod
DB_USERNAME=postgres
DB_PASSWORD=...

# Cache & Session
CACHE_STORE=redis
SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Cloud Storage
FILESYSTEM_DISK=local
GOOGLE_CLOUD_BUCKET=revenge-x-hq-prod-apk
GOOGLE_CLOUD_PROJECT_ID=...

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=warning
```

---

## Troubleshooting

### Build Failures

```bash
# Check GitHub Actions logs
# Ensure all secrets are set correctly
# Verify GCP_SA_KEY is valid base64
```

### Database Connection Issues

```bash
# Check Cloud SQL instance status
gcloud sql instances list

# Verify VPC connector (if using private IP)
gcloud compute networks vpc-access connectors list
```

### Deployment Health Check Fails

```bash
# Check service logs
gcloud run services logs tail revenge-x-hq-prod --region=us-central1

# Verify service is running
gcloud run services list
```

---

## File Structure

```
revenge-x-hq/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD workflow
├── deploy/
│   ├── dev.yaml                # Dev environment config
│   └── production.yaml         # Production config
├── docker/
│   ├── nginx.conf              # Nginx config
│   ├── php-fpm.conf            # PHP-FPM config
│   └── php.ini                 # PHP config
├── scripts/
│   ├── deploy-gcp.sh           # Manual deployment script
│   └── setup-gcp.sh            # Initial GCP setup script
├── Dockerfile                  # Container image
├── .gcloudignore               # Deployment exclusions
└── routes/web.php              # With health check endpoint
```

---

## Cost Estimates (Monthly)

| Service | Dev | Production |
|---------|-----|------------|
| Cloud Run | ~$0 | ~$20-100 |
| Cloud SQL | ~$10 | ~$50-200 |
| Cloud Storage | ~$0.10 | ~$1-5 |
| Memorystore (optional) | - | ~$30-100 |

---

## Next Steps

1. ✅ Create Google Cloud project
2. ✅ Enable APIs
3. ✅ Create resources (SQL, Storage, Artifact Registry)
4. ✅ Create service account and add to GitHub Secrets
5. ✅ Add all required secrets
6. ✅ Push to `dev-release` to test deployment
7. ✅ Configure domain mappings
8. ✅ Push to `main` for production deployment
