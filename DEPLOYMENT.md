# Google Cloud CI/CD Setup Guide

## Overview

This project uses GitHub Actions to automatically deploy to Google Cloud Run:
- **dev-release branch** → `dev.revenge-x-hq.com`
- **staging branch** → `staging.revenge-x-hq.com`
- **main branch** → `revenge-x-hq.com`

### CI/CD Features

- **Automated Testing**: PHPUnit tests with PostgreSQL service container
- **Docker Build**: Multi-stage builds with GitHub Actions cache
- **Database Migrations**: Automatic migrations via Cloud Run Jobs after deployment
- **Health Checks**: Automated health verification with rollback on failure
- **Notifications**: Slack and Discord notifications for all deployment events
- **Rollback**: Automatic rollback to previous revision on health check failure

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
export PROJECT_ID="revenge-x-hq"
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
  --tier=db-perf-optimized-N-2 \
  --region=us-central1

# Production
gcloud sql instances create revenge-x-hq-prod-db \
  --database-version=POSTGRES_18 \
  --tier=db-perf-optimized-N-4 \
  --region=us-central1 \
  --availability-type=REGIONAL

# Create databases
gcloud sql databases create revenge_x_hq_dev --instance=revenge-x-hq-dev-db
gcloud sql databases create revenge_x_hq_staging --instance=revenge-x-hq-staging-db
gcloud sql databases create revenge_x_hq_prod --instance=revenge-x-hq-prod-db

# Create Cloud Storage buckets
gsutil mb -p $PROJECT_ID gs://revenge-x-hq-dev-apk
gsutil mb -p $PROJECT_ID gs://revenge-x-hq-staging-apk
gsutil mb -p $PROJECT_ID gs://revenge-x-hq-prod-apk
```

---

## GitHub Secrets Configuration

Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

### Required Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `GCP_PROJECT_ID` | Google Cloud project ID | `revenge-x-hq` |
| `GCP_SA_KEY` | Service account key (base64) | `ewogICJ0eXBlIjog...` |
| `GCP_ARTIFACT_REPO` | Artifact repository name | `revenge-x-hq` |

### Dev Environment Secrets

| Secret Name | Description |
|------------|-------------|
| `DEV_APP_URL` | `https://dev.revenge-x-hq.com` |
| `DEV_DB_HOST` | Cloud SQL connection name |
| `DEV_DB_DATABASE` | `revenge_x_hq_dev` |
| `DEV_DB_USERNAME` | Database username |
| `DEV_DB_PASSWORD` | Database password |
| `DEV_REDIS_HOST` | *(leave empty - Redis not required for Cloud Run)* |
| `DEV_REDIS_PASSWORD` | *(leave empty)* |
| `DEV_APP_KEY` | Laravel APP_KEY (base64) |
| `DEV_STORAGE_BUCKET` | `revenge-x-hq-dev-apk` |

### Staging Environment Secrets

| Secret Name | Description |
|------------|-------------|
| `STAGING_APP_URL` | `https://staging.revenge-x-hq.com` |
| `STAGING_DB_HOST` | Cloud SQL connection name |
| `STAGING_DB_DATABASE` | `revenge_x_hq_staging` |
| `STAGING_DB_USERNAME` | Database username |
| `STAGING_DB_PASSWORD` | Database password |
| `STAGING_REDIS_HOST` | *(leave empty - Redis not required for Cloud Run)* |
| `STAGING_REDIS_PASSWORD` | *(leave empty)* |
| `STAGING_APP_KEY` | Laravel APP_KEY (base64) |
| `STAGING_STORAGE_BUCKET` | `revenge-x-hq-staging-apk` |

### Production Secrets

| Secret Name | Description |
|------------|-------------|
| `PROD_APP_URL` | `https://revenge-x-hq.com` |
| `PROD_DB_HOST` | Cloud SQL connection name |
| `PROD_DB_DATABASE` | `revenge_x_hq_prod` |
| `PROD_DB_USERNAME` | Database username |
| `PROD_DB_PASSWORD` | Database password |
| `PROD_REDIS_HOST` | *(leave empty - Redis not required for Cloud Run)* |
| `PROD_REDIS_PASSWORD` | *(leave empty)* |
| `PROD_APP_KEY` | Laravel APP_KEY (base64) |
| `PROD_STORAGE_BUCKET` | `revenge-x-hq-prod-apk` |

### Notification Secrets (Optional)

| Secret/Variable Name | Type | Description |
|---------------------|------|-------------|
| `SLACK_WEBHOOK_URL` | Secret | Slack incoming webhook URL for notifications |
| `DISCORD_WEBHOOK_URL` | Variable | Discord webhook URL for notifications |

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

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.deleter"

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

# Staging
gcloud run domain-mappings create \
  --domain=staging.revenge-x-hq.com \
  --service=revenge-x-hq-staging \
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
| CNAME | staging | `ghs.googlehosted.com` |
| CNAME | @ | `ghs.googlehosted.com` |

---

## Deployment Workflow

### Automatic Deployment (CI/CD)

The project uses **separate workflow files** for each environment:

**`.github/workflows/deploy-dev.yml`**
- Triggers: Push to `dev-release` or merged PR into `dev-release`
- Deploys to: `revenge-x-hq-dev` Cloud Run service
- URL: `https://dev.revenge-x-hq.com`
- Resources: 512Mi memory, 1 CPU, 0-10 instances

**`.github/workflows/deploy-staging.yml`**
- Triggers: Push to `staging` or merged PR into `staging`
- Deploys to: `revenge-x-hq-staging` Cloud Run service
- URL: `https://staging.revenge-x-hq.com`
- Resources: 768Mi memory, 2 CPU, 0-10 instances

**`.github/workflows/deploy-production.yml`**
- Triggers: Push to `main` or merged PR into `main`
- Deploys to: `revenge-x-hq-prod` Cloud Run service
- URL: `https://revenge-x-hq.com`
- Resources: 1Gi memory, 2 CPU, 2-100 instances

### CI/CD Pipeline Steps

Each deployment workflow includes:

1. **Tests** - Run PHPUnit tests with PostgreSQL
2. **Build** - Build Docker image with frontend assets
3. **Push** - Push image to Google Artifact Registry
4. **Notify Start** - Send deployment start notification (Slack/Discord)
5. **Deploy** - Deploy to Cloud Run
6. **Migrate** - Run database migrations via Cloud Run Jobs
7. **Health Check** - Verify deployment success (with retries)
8. **Rollback** - Automatic rollback on health check failure
9. **Notify Result** - Send success/failure/rollback notification

### Rollback Mechanism

If health check fails, the workflow automatically:
- Retrieves the previous Cloud Run revision
- Rolls back to the previous revision
- Verifies rollback health
- Sends rollback notification

### Database Migrations

After each deployment, database migrations run automatically:
- Creates a temporary Cloud Run Job
- Executes `php artisan migrate --force`
- Cleans up the job after completion

### Notifications

Configure Slack or Discord webhooks to receive:
- Deployment started notifications
- Deployment success notifications
- Deployment failure notifications
- Rollback execution notifications

### Manual Deployment

```bash
# Deploy to dev
./scripts/deploy-gcp.sh dev

# Deploy to production
./scripts/deploy-gcp.sh prod
```

---

## CI/CD Testing Configuration

The GitHub Actions workflows include:

### PostgreSQL Service Container
- **Version**: PostgreSQL 18
- **Database**: `revenge_test`
- **User**: `revenge`
- **Password**: `revenge`

### Frontend Build
- **Node.js**: 22
- **Build Command**: `npm run build`
- **Output**: Vite manifest for asset loading

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

# Staging
curl https://staging.revenge-x-hq.com/api/health

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
│       ├── deploy-dev.yml         # Dev deployment workflow
│       ├── deploy-staging.yml     # Staging deployment workflow
│       └── deploy-production.yml  # Production deployment workflow
├── deploy/
│   ├── dev.yaml                   # Dev environment config
│   └── production.yaml            # Production config
├── docker/
│   ├── nginx.conf                 # Nginx config
│   ├── php-fpm.conf               # PHP-FPM config
│   └── php.ini                    # PHP config
├── scripts/
│   ├── deploy-gcp.sh              # Manual deployment script
│   └── setup-gcp.sh               # Initial GCP setup script
├── Dockerfile                     # Container image
├── .gcloudignore                  # Deployment exclusions
├── phpunit.xml                    # PHPUnit configuration
└── routes/web.php                 # With health check endpoint
```

---

## Cost Estimates (Monthly)

| Service | Dev | Staging | Production |
|---------|-----|---------|------------|
| Cloud Run | ~$0 | ~$5-20 | ~$20-100 |
| Cloud SQL | ~$10 | ~$15 | ~$50-200 |
| Cloud Storage | ~$0.10 | ~$0.10 | ~$1-5 |
| Memorystore (optional) | - | - | ~$30-100 |

---

## Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes & Test Locally**
   ```bash
   ./vendor/bin/sail npm run build
   ./vendor/bin/sail test
   ```

3. **Create PR to dev-release**
   - Creates PR: `feature/new-feature` → `dev-release`
   - On merge: Auto-deploys to `dev.revenge-x-hq.com`

4. **Promote to Staging**
   - Creates PR: `dev-release` → `staging`
   - On merge: Auto-deploys to `staging.revenge-x-hq.com`
   - Test in production-like environment

5. **Promote to Production**
   - Creates PR: `staging` → `main`
   - On merge: Auto-deploys to `revenge-x-hq.com`

---

## Next Steps

1. ✅ Create Google Cloud project
2. ✅ Enable APIs
3. ✅ Create resources (SQL, Storage, Artifact Registry)
4. ✅ Create service account and add to GitHub Secrets
5. ✅ Add all required secrets (see GITHUB_SECRETS.md)
6. ✅ Push to `dev-release` to test deployment
7. ✅ Create and push to `staging` branch for staging environment
8. ✅ Configure domain mappings
9. ✅ Push to `main` for production deployment
10. ✅ (Optional) Add Slack/Discord webhooks for notifications
