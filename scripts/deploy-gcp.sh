#!/bin/bash

# Google Cloud Deployment Script
# Usage: ./scripts/deploy-gcp.sh [dev|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default environment
ENV=${1:-dev}

# Validate environment
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
    echo -e "${RED}Error: Invalid environment. Use 'dev' or 'prod'${NC}"
    exit 1
fi

# Load environment config
if [ "$ENV" = "dev" ]; then
    CONFIG_FILE="$PROJECT_ROOT/deploy/dev.yaml"
    BRANCH="dev-release"
    SERVICE_NAME="revenge-browser-dev"
    DOMAIN="dev.revengebrowser.com"
else
    CONFIG_FILE="$PROJECT_ROOT/deploy/production.yaml"
    BRANCH="main"
    SERVICE_NAME="revenge-browser-prod"
    DOMAIN="revengebrowser.com"
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deploying to: ${ENV} (${DOMAIN})${NC}"
echo -e "${GREEN}========================================${NC}"

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check authentication
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q .; then
    echo -e "${RED}Error: Not authenticated with gcloud${NC}"
    echo "Run: gcloud auth login"
    exit 1
fi

# Check if on correct branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    echo -e "${YELLOW}Warning: You are on '$CURRENT_BRANCH' but deploying '$BRANCH'${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No project set. Run: gcloud config set project PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"
echo -e "  Project: $PROJECT_ID"
echo -e "  Branch: $BRANCH"
echo -e "  Service: $SERVICE_NAME"

# Build Docker image
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/revenge-browser/${SERVICE_NAME}:${BRANCH}-$(git rev-parse --short HEAD)"

echo -e "\n${YELLOW}Building Docker image...${NC}"
gcloud builds submit --tag "$IMAGE_NAME" --project="$PROJECT_ID"

# Deploy to Cloud Run
echo -e "\n${YELLOW}Deploying to Cloud Run...${NC}"

if [ "$ENV" = "dev" ]; then
    gcloud run deploy "$SERVICE_NAME" \
        --image="$IMAGE_NAME" \
        --region="$REGION" \
        --platform=managed \
        --allow-unauthenticated \
        --memory=512Mi \
        --cpu=1 \
        --min-instances=0 \
        --max-instances=10 \
        --timeout=300 \
        --port=8080 \
        --set-env-vars="APP_URL=https://${DOMAIN},APP_ENV=production,APP_DEBUG=false,LOG_LEVEL=info"
else
    gcloud run deploy "$SERVICE_NAME" \
        --image="$IMAGE_NAME" \
        --region="$REGION" \
        --platform=managed \
        --allow-unauthenticated \
        --memory=1Gi \
        --cpu=2 \
        --min-instances=2 \
        --max-instances=100 \
        --timeout=300 \
        --port=8080 \
        --set-env-vars="APP_URL=https://${DOMAIN},APP_ENV=production,APP_DEBUG=false,LOG_LEVEL=warning"
fi

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)")

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Successful!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Service URL: ${SERVICE_URL}"
echo -e "Domain: https://${DOMAIN}"
echo -e "\nTo map domain, run:"
echo -e "  gcloud run domain-mappings create --domain=${DOMAIN} --service=${SERVICE_NAME} --region=${REGION}"
