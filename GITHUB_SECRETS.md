# GitHub Secrets Setup Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Required Secrets Overview](#required-secrets-overview)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Add Each Secret](#add-each-secret)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Go to GitHub Secrets Page

Click this link or copy/paste into your browser:
```
https://github.com/muftimehedi/revenge-x-hq/settings/secrets/actions
```

---

## Required Secrets Overview

**Total Secrets Required: 21**

### Priority Order (Add in This Order)

1. **Core Secrets (3)** - Required for CI/CD to work
2. **Dev Environment Secrets (9)** - Required for dev deployment
3. **Production Secrets (9)** - Required for production deployment

---

## Step-by-Step Setup

### Step 1: Create Service Account & Generate Key

**Using Google Cloud Console:**

1. **Go to Service Accounts Page**
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=revenge-browser-hq
   ```

2. **Create Service Account**
   - Click **"Create Service Account"**
   - **Service account name**: `github-actions`
   - **Service account description**: `GitHub Actions Deployer`
   - Click **"Create and Continue"**

3. **Grant Roles** (click **"Continue"** after each, then **"Done"**)
   - ☑️ **Cloud Run Admin** (`roles/run.admin`)
   - ☑️ **Cloud SQL Client** (`roles/cloudsql.client`)
   - ☑️ **Storage Object Admin** (`roles/storage.objectAdmin`)
   - ☑️ **Artifact Registry Writer** (`roles/artifactregistry.writer`)

4. **Create Service Account Key**
   - Click on the **`github-actions`** service account (from the list)
   - Go to **"Keys"** tab
   - Click **"Add Key"** → **"Create new key"**
   - Key type: **JSON**
   - Click **"Create"**
   - The JSON file will download automatically

5. **Convert Key to Base64**

   **On macOS/Linux:**
   ```bash
   cat ~/Downloads/*.json | base64 -w 0
   ```

   **On Windows (PowerShell):**
   ```powershell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\Downloads\*.json"))
   ```

   **Online Tool (Alternative):**
   - Go to: https://www.base64encode.org/
   - Upload the JSON file
   - Copy the encoded string

---

## Add Each Secret

For each secret below:
1. Click **"New repository secret"**
2. Enter the **Name** exactly as shown
3. Paste the **Value**
4. Click **"Add secret"**

---

### Part 1: Core Secrets (3 required)

#### Secret 1: GCP_PROJECT_ID
```
Name: GCP_PROJECT_ID
Value: revenge-x-hq
```

#### Secret 2: GCP_ARTIFACT_REPO
```
Name: GCP_ARTIFACT_REPO
Value: revenge-x-hq
```

#### Secret 3: GCP_SA_KEY
```
Name: GCP_SA_KEY
Value: [Paste the base64 encoded service account key from Step 1]
```

**⚠️ IMPORTANT:** These 3 secrets are the **minimum required** for CI/CD to work. Without them, the workflow will fail.

---

### Part 2: Dev Environment Secrets (9 required)

#### Secret 4: DEV_APP_URL
```
Name: DEV_APP_URL
Value: https://dev.revenge-x-hq.com
```

#### Secret 5: DEV_DB_HOST
```
Name: DEV_DB_HOST
Value: revenge-x-hq:us-central1:revenge-x-hq-dev-db
```

#### Secret 6: DEV_DB_DATABASE
```
Name: DEV_DB_DATABASE
Value: revenge_x_hq_dev
```

#### Secret 7: DEV_DB_USERNAME
```
Name: DEV_DB_USERNAME
Value: postgres
```

#### Secret 8: DEV_DB_PASSWORD
```
Name: DEV_DB_PASSWORD
Value: RevengeXHQ_Dev_2026
```

#### Secret 9: DEV_REDIS_HOST
```
Name: DEV_REDIS_HOST
Value: 127.0.0.1
```

#### Secret 10: DEV_REDIS_PASSWORD
```
Name: DEV_REDIS_PASSWORD
Value: [Leave empty or enter redis password]
```

#### Secret 11: DEV_APP_KEY
```
Name: DEV_APP_KEY
Value: base64:ZivrvUvri0Zh7lp5RrCTwXKmiTmtZ3elzc5qv9lGVu4=
```

#### Secret 12: DEV_STORAGE_BUCKET
```
Name: DEV_STORAGE_BUCKET
Value: revenge-x-hq-dev-apk
```

---

### Part 3: Production Environment Secrets (9 required)

#### Secret 13: PROD_APP_URL
```
Name: PROD_APP_URL
Value: https://revenge-x-hq.com
```

#### Secret 14: PROD_DB_HOST
```
Name: PROD_DB_HOST
Value: revenge-x-hq:us-central1:revenge-x-hq-prod-db
```

#### Secret 15: PROD_DB_DATABASE
```
Name: PROD_DB_DATABASE
Value: revenge_x_hq_prod
```

#### Secret 16: PROD_DB_USERNAME
```
Name: PROD_DB_USERNAME
Value: postgres
```

#### Secret 17: PROD_DB_PASSWORD
```
Name: PROD_DB_PASSWORD
Value: RevengeXHQ_Prod_2026_Secure!
```

#### Secret 18: PROD_REDIS_HOST
```
Name: PROD_REDIS_HOST
Value: 127.0.0.1
```

#### Secret 19: PROD_REDIS_PASSWORD
```
Name: PROD_REDIS_PASSWORD
Value: [Leave empty or enter redis password]
```

#### Secret 20: PROD_APP_KEY
```
Name: PROD_APP_KEY
Value: base64:ZivrvUvri0Zh7lp5RrCTwXKmiTmtZ3elzc5qv9lGVu4=
```

#### Secret 21: PROD_STORAGE_BUCKET
```
Name: PROD_STORAGE_BUCKET
Value: revenge-x-hq-prod-apk
```

---

## Verification

After adding all secrets, verify they appear in your secrets list:

**Go to:** https://github.com/muftimehedi/revenge-x-hq/settings/secrets/actions

You should see all 21 secrets listed:

### Core Secrets (3)
- ✓ GCP_PROJECT_ID
- ✓ GCP_ARTIFACT_REPO
- ✓ GCP_SA_KEY

### Dev Environment (9)
- ✓ DEV_APP_URL
- ✓ DEV_DB_HOST
- ✓ DEV_DB_DATABASE
- ✓ DEV_DB_USERNAME
- ✓ DEV_DB_PASSWORD
- ✓ DEV_REDIS_HOST
- ✓ DEV_REDIS_PASSWORD
- ✓ DEV_APP_KEY
- ✓ DEV_STORAGE_BUCKET

### Production Environment (9)
- ✓ PROD_APP_URL
- ✓ PROD_DB_HOST
- ✓ PROD_DB_DATABASE
- ✓ PROD_DB_USERNAME
- ✓ PROD_DB_PASSWORD
- ✓ PROD_REDIS_HOST
- ✓ PROD_REDIS_PASSWORD
- ✓ PROD_APP_KEY
- ✓ PROD_STORAGE_BUCKET

---

## After Adding Secrets

Once all secrets are added, GitHub Actions will automatically:

1. **Run tests** on your code (with PostgreSQL and frontend build)
2. **Build Docker image** and push to Google Cloud
3. **Deploy to dev.revenge-x-hq.com** (when pushing to `dev-release` branch)
4. **Deploy to revenge-x-hq.com** (when pushing to `main` branch)

### Monitor Deployment

Watch your deployment here:
```
https://github.com/muftimehedi/revenge-x-hq/actions
```

---

## Quick Reference (Copy All)

```
=====================================
CORE SECRETS (Required First)
=====================================
GCP_PROJECT_ID = revenge-x-hq
GCP_ARTIFACT_REPO = revenge-x-hq
GCP_SA_KEY = [Base64 encoded service account key - provided separately]

=====================================
DEV ENVIRONMENT
=====================================
DEV_APP_URL = https://dev.revenge-x-hq.com
DEV_DB_HOST = revenge-x-hq:us-central1:revenge-x-hq-dev-db
DEV_DB_DATABASE = revenge_x_hq_dev
DEV_DB_USERNAME = postgres
DEV_DB_PASSWORD = RevengeXHQ_Dev_2026
DEV_REDIS_HOST = 127.0.0.1
DEV_REDIS_PASSWORD =
DEV_APP_KEY = base64:ZivrvUvri0Zh7lp5RrCTwXKmiTmtZ3elzc5qv9lGVu4=
DEV_STORAGE_BUCKET = revenge-x-hq-dev-apk

=====================================
PRODUCTION ENVIRONMENT
=====================================
PROD_APP_URL = https://revenge-x-hq.com
PROD_DB_HOST = revenge-x-hq:us-central1:revenge-x-hq-prod-db
PROD_DB_DATABASE = revenge_x_hq_prod
PROD_DB_USERNAME = postgres
PROD_DB_PASSWORD = RevengeXHQ_Prod_2026_Secure!
PROD_REDIS_HOST = 127.0.0.1
PROD_REDIS_PASSWORD =
PROD_APP_KEY = base64:ZivrvUvri0Zh7lp5RrCTwXKmiTmtZ3elzc5qv9lGVu4=
PROD_STORAGE_BUCKET = revenge-x-hq-prod-apk
```

---

## Troubleshooting

### Q: I don't have access to the revenge-x-hq project

**A:** You have two options:

1. **Request access** from the project owner
2. **Use your own GCP project**:
   - Create a service account in your project
   - Add the required roles (Cloud Run Admin, Cloud SQL Client, Storage Object Admin, Artifact Registry Writer)
   - Update `GCP_PROJECT_ID` secret to your project ID

### Q: Where do I find the service account key?

**A:**
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Select your project: `revenge-x-hq`
3. Click on `github-actions` service account
4. Go to "Keys" tab
5. Click "Add Key" → "Create new key"

### Q: The workflow fails after adding secrets

**A:** Check the following:
- All secret names match exactly (case-sensitive)
- `GCP_SA_KEY` has no extra spaces or newlines
- Service account has all required roles
- You added at least the 3 core secrets

### Q: How do I update a secret?

**A:**
1. Click on the secret name
2. Click "Update secret"
3. Paste new value and save

### Q: I can't find the secrets page

**A:**
- Make sure you're logged into GitHub
- Use the direct link: https://github.com/muftimehedi/revenge-x-hq/settings/secrets/actions
- Go to: Settings → Secrets and variables → Actions

### Q: The CI/CD still fails with authentication error

**A:** Verify:
1. Service account key is valid and not expired
2. Base64 encoding is correct (no extra characters)
3. Service account has these roles:
   - `roles/run.admin`
   - `roles/cloudsql.client`
   - `roles/storage.objectAdmin`
   - `roles/artifactregistry.writer`

---

## Using Your Own GCP Project

If you're using your own GCP project instead of `revenge-x-hq`:

### Update These Secrets:

```
GCP_PROJECT_ID = [your-project-id]
GCP_ARTIFACT_REPO = [your-repo-name]
```

### Update Database Hosts:

```
DEV_DB_HOST = [your-project]:us-central1:[your-dev-db-instance]
PROD_DB_HOST = [your-project]:us-central1:[your-prod-db-instance]
```

---

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit** service account keys to the repository
2. **Use strong, unique passwords** for database passwords
3. **Rotate keys regularly** - every 90 days recommended
4. **Limit access** - only give access to team members who need it
5. **Monitor usage** - check Google Cloud logs for suspicious activity
6. **Delete old keys** - remove unused keys from service accounts

---

## What Each Secret Does

| Secret | Purpose |
|--------|---------|
| `GCP_PROJECT_ID` | Identifies your Google Cloud project |
| `GCP_SA_KEY` | Authenticates GitHub Actions to GCP |
| `GCP_ARTIFACT_REPO` | Docker image repository name |
| `DEV_APP_URL` | Base URL for dev environment |
| `DEV_DB_*` | Database connection for dev |
| `DEV_APP_KEY` | Laravel encryption key for dev |
| `DEV_STORAGE_BUCKET` | Cloud Storage bucket for dev APKs |
| `PROD_APP_URL` | Base URL for production |
| `PROD_DB_*` | Database connection for production |
| `PROD_APP_KEY` | Laravel encryption key for production |
| `PROD_STORAGE_BUCKET` | Cloud Storage bucket for production APKs |

---

## Need Help?

- **GitHub Issues**: https://github.com/muftimehedi/revenge-x-hq/issues
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Full Documentation**: See `DOCUMENTATION.md`

---

**Last Updated:** January 29, 2026
**Version:** 2.0
