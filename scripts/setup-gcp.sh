#!/bin/bash

# Google Cloud Setup Script for Revenge X HQ
# This script sets up all required GCP resources

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_ID="revenge-x-hq"
PROJECT_NAME="Revenge X HQ"
REGION="us-central1"
ZONE="us-central1-a"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Revenge X HQ - GCP Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Project ID: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo ""
    echo "Install gcloud CLI:"
    echo "  macOS:   brew install google-cloud-sdk"
    echo "  Linux:   curl https://sdk.cloud.google.com | bash"
    echo "  Windows: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check authentication
echo -e "${YELLOW}Step 1: Authenticate with Google Cloud${NC}"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q .; then
    echo "Not authenticated. Running gcloud auth login..."
    gcloud auth login
fi
echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# Create project
echo -e "${YELLOW}Step 2: Create Google Cloud Project${NC}"
if gcloud projects describe "$PROJECT_ID" &>/dev/null; then
    echo -e "${GREEN}✓ Project $PROJECT_ID already exists${NC}"
    gcloud config set project "$PROJECT_ID"
else
    echo "Creating project: $PROJECT_ID"
    gcloud projects create "$PROJECT_ID" --name="$PROJECT_NAME" --set-as-default
    echo -e "${GREEN}✓ Project created${NC}"

    # Link billing account
    echo ""
    echo -e "${YELLOW}⚠️  ACTION REQUIRED: Link Billing Account${NC}"
    echo ""
    echo "1. Open: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
    echo "2. Select or create a billing account"
    echo "3. Press Enter when billing is enabled..."
    read -r
fi
echo ""

# Enable APIs
echo -e "${YELLOW}Step 3: Enable Required APIs${NC}"
gcloud services enable \
    artifactregistry.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    cloudbuild.googleapis.com \
    secretmanager.googleapis.com \
    compute.googleapis.com \
    redis.googleapis.com \
    --project="$PROJECT_ID"
echo -e "${GREEN}✓ APIs enabled${NC}"
echo ""

# Create Artifact Registry
echo -e "${YELLOW}Step 4: Create Artifact Registry${NC}"
if gcloud artifacts repositories describe revenge-x-hq --location=us --project="$PROJECT_ID" &>/dev/null; then
    echo -e "${GREEN}✓ Artifact Registry already exists${NC}"
else
    gcloud artifacts repositories create revenge-x-hq \
        --repository-format=docker \
        --location=us \
        --description="Docker repository for Revenge X HQ" \
        --project="$PROJECT_ID"
    echo -e "${GREEN}✓ Artifact Registry created${NC}"
fi
echo ""

# Create Cloud SQL instances
echo -e "${YELLOW}Step 5: Create Cloud SQL (PostgreSQL)${NC}"

# Dev database
if gcloud sql instances describe revenge-x-hq-dev-db --project="$PROJECT_ID" &>/dev/null; then
    echo -e "${GREEN}✓ Dev database already exists${NC}"
else
    echo "Creating dev database..."
    gcloud sql instances create revenge-x-hq-dev-db \
        --database-version=POSTGRES_18 \
        --tier=db-f1-micro \
        --region="$REGION" \
        --storage-auto-increase \
        --project="$PROJECT_ID"
    echo -e "${GREEN}✓ Dev database created${NC}"
fi

# Production database
if gcloud sql instances describe revenge-x-hq-prod-db --project="$PROJECT_ID" &>/dev/null; then
    echo -e "${GREEN}✓ Production database already exists${NC}"
else
    echo "Creating production database..."
    gcloud sql instances create revenge-x-hq-prod-db \
        --database-version=POSTGRES_18 \
        --tier=db-custom-2-7680 \
        --region="$REGION" \
        --availability-type=REGIONAL \
        --storage-auto-increase \
        --backup-start-time=03:00 \
        --project="$PROJECT_ID"
    echo -e "${GREEN}✓ Production database created${NC}"
fi

# Create databases
echo ""
echo "Creating databases..."
gcloud sql databases create revenge_x_hq_dev --instance=revenge-x-hq-dev-db --project="$PROJECT_ID" 2>/dev/null || echo "Database already exists"
gcloud sql databases create revenge_x_hq_prod --instance=revenge-x-hq-prod-db --project="$PROJECT_ID" 2>/dev/null || echo "Database already exists"
echo -e "${GREEN}✓ Databases created${NC}"
echo ""

# Create Cloud Storage buckets
echo -e "${YELLOW}Step 6: Create Cloud Storage Buckets${NC}"
if gsutil ls -p "$PROJECT_ID" gs://revenge-x-hq-dev-apk &>/dev/null; then
    echo -e "${GREEN}✓ Dev storage bucket already exists${NC}"
else
    gsutil mb -p "$PROJECT_ID" -l "$REGION" gs://revenge-x-hq-dev-apk
    echo -e "${GREEN}✓ Dev storage bucket created${NC}"
fi

if gsutil ls -p "$PROJECT_ID" gs://revenge-x-hq-prod-apk &>/dev/null; then
    echo -e "${GREEN}✓ Production storage bucket already exists${NC}"
else
    gsutil mb -p "$PROJECT_ID" -l "$REGION" gs://revenge-x-hq-prod-apk
    echo -e "${GREEN}✓ Production storage bucket created${NC}"
fi
echo ""

# Create service account
echo -e "${YELLOW}Step 7: Create Service Account for CI/CD${NC}"
SA_EMAIL="github-actions@${PROJECT_ID}.iam.gserviceaccount.com"
if gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" &>/dev/null; then
    echo -e "${GREEN}✓ Service account already exists${NC}"
else
    gcloud iam service-accounts create github-actions \
        --display-name="GitHub Actions Deployer" \
        --description="Service account for GitHub Actions CI/CD" \
        --project="$PROJECT_ID"
    echo -e "${GREEN}✓ Service account created${NC}"
fi
echo ""

# Grant roles to service account
echo -e "${YELLOW}Step 8: Grant Permissions to Service Account${NC}"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/run.admin" \
    --condition=None >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/cloudsql.client" \
    --condition=None >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/storage.objectAdmin" \
    --condition=None >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/secretmanager.secretAccessor" \
    --condition=None >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/artifactregistry.writer" \
    --condition=None >/dev/null 2>&1 || true

echo -e "${GREEN}✓ Permissions granted${NC}"
echo ""

# Create service account key
echo -e "${YELLOW}Step 9: Create Service Account Key${NC}"
echo "Creating service account key..."
gcloud iam service-accounts keys create gcp-sa-key.json \
    --iam-account="$SA_EMAIL" \
    --project="$PROJECT_ID"
echo -e "${GREEN}✓ Service account key created: gcp-sa-key.json${NC}"
echo ""

# Generate base64 encoded key
BASE64_KEY=$(cat gcp-sa-key.json | base64 -w 0)

# Get database connection info
echo -e "${YELLOW}Step 10: Get Database Connection Info${NC}"
DEV_DB_CONNECTION="${PROJECT_ID}:${REGION}:revenge-x-hq-dev-db"
PROD_DB_CONNECTION="${PROJECT_ID}:${REGION}:revenge-x-hq-prod-db"
echo "Dev DB Connection: ${DEV_DB_CONNECTION}"
echo "Prod DB Connection: ${PROD_DB_CONNECTION}"
echo ""

# Generate Laravel APP_KEY
echo -e "${YELLOW}Step 11: Generate Laravel APP_KEY${NC}"
cd "$(dirname "$0")/.."
APP_KEY=$(php artisan key:generate --show 2>/dev/null || echo "base64:$(openssl rand -base64 32)")
echo "Generated APP_KEY"
echo ""

# Print GitHub Secrets
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}ADD THESE TO GITHUB SECRETS${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Go to: https://github.com/YOUR_USERNAME/revenge-x-hq/settings/secrets/actions${NC}"
echo ""
echo "Required Secrets:"
echo ""
echo -e "${YELLOW}# Core Secrets${NC}"
echo "GCP_PROJECT_ID=${PROJECT_ID}"
echo "GCP_SA_KEY=${BASE64_KEY}"
echo "GCP_ARTIFACT_REPO=revenge-x-hq"
echo ""
echo -e "${YELLOW}# Dev Environment${NC}"
echo "DEV_APP_URL=https://dev.revenge-x-hq.com"
echo "DEV_DB_HOST=${DEV_DB_CONNECTION}"
echo "DEV_DB_DATABASE=revenge_x_hq_dev"
echo "DEV_DB_USERNAME=postgres"
echo "DEV_DB_PASSWORD=YOUR_DEV_DB_PASSWORD"
echo "DEV_REDIS_HOST=10.0.0.3  # Update after Redis creation"
echo "DEV_REDIS_PASSWORD=YOUR_DEV_REDIS_PASSWORD"
echo "DEV_APP_KEY=${APP_KEY}"
echo "DEV_STORAGE_BUCKET=revenge-x-hq-dev-apk"
echo ""
echo -e "${YELLOW}# Production Environment${NC}"
echo "PROD_APP_URL=https://revenge-x-hq.com"
echo "PROD_DB_HOST=${PROD_DB_CONNECTION}"
echo "PROD_DB_DATABASE=revenge_x_hq_prod"
echo "PROD_DB_USERNAME=postgres"
echo "PROD_DB_PASSWORD=YOUR_PROD_DB_PASSWORD"
echo "PROD_REDIS_HOST=10.0.0.4  # Update after Redis creation"
echo "PROD_REDIS_PASSWORD=YOUR_PROD_REDIS_PASSWORD"
echo "PROD_APP_KEY=${APP_KEY}"
echo "PROD_STORAGE_BUCKET=revenge-x-hq-prod-apk"
echo ""
echo -e "${RED}IMPORTANT: Set strong passwords for DB and Redis!${NC}"
echo ""

# Set database passwords
echo -e "${YELLOW}Step 12: Set Database Passwords${NC}"
echo ""
read -p "Enter password for dev database: " DEV_DB_PASSWORD
read -sp "Enter password for production database: " PROD_DB_PASSWORD
echo ""

gcloud sql users set-password postgres \
    --instance=revenge-x-hq-dev-db \
    --password="$DEV_DB_PASSWORD" \
    --project="$PROJECT_ID"

gcloud sql users set-password postgres \
    --instance=revenge-x-hq-prod-db \
    --password="$PROD_DB_PASSWORD" \
    --project="$PROJECT_ID"

echo -e "${GREEN}✓ Database passwords set${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Add the GitHub Secrets shown above"
echo "2. Create dev-release branch: git checkout -b dev-release"
echo "3. Push to GitHub: git push origin dev-release"
echo "4. Monitor deployment in GitHub Actions"
echo ""
echo "Service account key saved to: gcp-sa-key.json"
echo "Keep this file secure!"
