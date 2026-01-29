# Revenge Browser - Complete Documentation

## 📚 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Local Development Setup](#-local-development-setup)
4. [Google Cloud Deployment](#-google-cloud-deployment)
5. [CI/CD Pipeline](#-cicd-pipeline)
6. [API Documentation](#-api-documentation)
7. [Admin Panel](#-admin-panel)
8. [Troubleshooting](#-troubleshooting)
9. [Command Reference](#-command-reference)

---

## 🚀 Project Overview

**Revenge Browser** is a privacy-focused, gaming-optimized Android browser with a "Play-to-Earn" (P2E) ecosystem. The project includes:

- **Public Website**: Modern landing page for user acquisition
- **Download System**: Secure, rate-limited APK downloads
- **Admin Panel**: P2E economy management, user management, APK releases
- **CI/CD Pipeline**: Automated deployment to Google Cloud

### Domains

| Environment | Branch | Domain |
|------------|--------|--------|
| **Development** | `dev-release` | `dev.revengebrowser.com` |
| **Production** | `main` | `revengebrowser.com` |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12 (PHP 8.4)
- **Database**: PostgreSQL 18
- **Cache/Queue**: Redis
- **Authentication**: Laravel Sanctum
- **Email Testing**: Mailpit

### Frontend
- **Framework**: React 19
- **Integration**: Inertia.js
- **Styling**: Tailwind CSS v4 + Custom CSS
- **Build Tool**: Vite

### Infrastructure
- **Development**: Docker + Laravel Sail
- **Production**: Google Cloud Run
- **Database**: Google Cloud SQL
- **Storage**: Google Cloud Storage
- **CI/CD**: GitHub Actions

---

## 💻 Local Development Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- Git
- Text Editor/IDE

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/muftimehedi/revenge-browser-hq.git
   cd revenge-browser-hq
   ```

2. **Install Dependencies**
   ```bash
   # Using Docker (no local PHP needed)
   docker run --rm \
       -u "$(id -u):$(id -g)" \
       -v "$(pwd):/var/www/html" \
       -w /var/www/html \
       laravelsail/php84-composer:latest \
       composer install --ignore-platform-reqs
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Start Sail**
   ```bash
   ./vendor/bin/sail up -d
   ```

5. **Generate APP_KEY & Run Migrations**
   ```bash
   ./vendor/bin/sail artisan key:generate
   ./vendor/bin/sail artisan migrate --force
   ```

6. **Install & Build Frontend**
   ```bash
   ./vendor/bin/sail npm install
   ./vendor/bin/sail npm run build
   ```

7. **Access the Site**
   - **Application**: http://localhost
   - **Admin Login**: http://localhost/admin/login

### Admin Credentials

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@revenge.com` | `password123` |

---

## ☁️ Google Cloud Deployment

### Quick Setup (Automated)

Run the automated setup script:

```bash
./scripts/setup-gcp.sh
```

This script will:
- ✅ Create Google Cloud project
- ✅ Enable required APIs
- ✅ Create Cloud SQL databases (dev + production)
- ✅ Create Cloud Storage buckets
- ✅ Create service account with permissions
- ✅ Generate GitHub secrets

### Manual Setup

If you prefer manual setup:

1. **Create Google Cloud Project**
   ```bash
   gcloud projects create revenge-browser-hq
   gcloud config set project revenge-browser-hq
   ```

2. **Enable APIs**
   ```bash
   gcloud services enable \
       artifactregistry.googleapis.com \
       run.googleapis.com \
       sqladmin.googleapis.com \
       cloudbuild.googleapis.com \
       secretmanager.googleapis.com
   ```

3. **Create Resources**

   **Cloud SQL (PostgreSQL)**
   ```bash
   # Dev Database
   gcloud sql instances create revenge-browser-dev-db \
       --database-version=POSTGRES_18 \
       --tier=db-perf-optimized-N-2 \
       --region=us-central1

   # Production Database
   gcloud sql instances create revenge-browser-prod-db \
       --database-version=POSTGRES_18 \
       --tier=db-perf-optimized-N-4 \
       --region=us-central1 \
       --availability-type=REGIONAL
   ```

   **Cloud Storage**
   ```bash
   gsutil mb -p revenge-browser-hq -l us-central1 gs://revenge-browser-dev-apk
   gsutil mb -p revenge-browser-hq -l us-central1 gs://revenge-browser-prod-apk
   ```

4. **Create Service Account**
   ```bash
   gcloud iam service-accounts create github-actions \
       --display-name="GitHub Actions Deployer"

   # Grant roles
   gcloud projects add-iam-policy-binding revenge-browser-hq \
       --member="serviceAccount:github-actions@revenge-browser-hq.iam.gserviceaccount.com" \
       --role="roles/run.admin"

   gcloud projects add-iam-policy-binding revenge-browser-hq \
       --member="serviceAccount:github-actions@revenge-browser-hq.iam.gserviceaccount.com" \
       --role="roles/cloudsql.client"

   # Create key
   gcloud iam service-accounts keys create gcp-sa-key.json \
       --iam-account=github-actions@revenge-browser-hq.iam.gserviceaccount.com
   ```

5. **Configure Domain**

   **DNS Records:**
   | Type | Name | Value |
   |------|------|-------|
   | CNAME | dev | `ghs.googlehosted.com` |
   | CNAME | @ | `ghs.googlehosted.com` |

   **Create Domain Mappings:**
   ```bash
   # Dev
   gcloud run domain-mappings create \
       --domain=dev.revengebrowser.com \
       --service=revenge-browser-dev \
       --region=us-central1

   # Production
   gcloud run domain-mappings create \
       --domain=revengebrowser.com \
       --service=revenge-browser-prod \
       --region=us-central1
   ```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The project uses GitHub Actions for automated deployment:

```
Push to dev-release → Tests → Build → Deploy to dev.revengebrowser.com
Push to main       → Tests → Build → Deploy to revengebrowser.com (canary)
```

### Required GitHub Secrets

Add these at `https://github.com/YOUR_USERNAME/revenge-browser-hq/settings/secrets/actions`:

#### Core Secrets

| Secret Name | Value |
|------------|-------|
| `GCP_PROJECT_ID` | `revenge-browser-hq` |
| `GCP_SA_KEY` | Base64 encoded service account key |
| `GCP_ARTIFACT_REPO` | `revenge-browser` |

#### Dev Environment Secrets

| Secret Name | Value |
|------------|-------|
| `DEV_APP_URL` | `https://dev.revengebrowser.com` |
| `DEV_DB_HOST` | `revenge-browser-hq:us-central1:revenge-browser-dev-db` |
| `DEV_DB_DATABASE` | `revenge_browser_dev` |
| `DEV_DB_USERNAME` | `postgres` |
| `DEV_DB_PASSWORD` | *(your database password)* |
| `DEV_REDIS_HOST` | `127.0.0.1` |
| `DEV_REDIS_PASSWORD` | *(empty or redis password)* |
| `DEV_APP_KEY` | `base64:...` (generate with `php artisan key:generate`) |
| `DEV_STORAGE_BUCKET` | `revenge-browser-dev-apk` |

#### Production Secrets

| Secret Name | Value |
|------------|-------|
| `PROD_APP_URL` | `https://revengebrowser.com` |
| `PROD_DB_HOST` | `revenge-browser-hq:us-central1:revenge-browser-prod-db` |
| `PROD_DB_DATABASE` | `revenge_browser_prod` |
| `PROD_DB_USERNAME` | `postgres` |
| `PROD_DB_PASSWORD` | *(your database password)* |
| `PROD_REDIS_HOST` | `127.0.0.1` |
| `PROD_REDIS_PASSWORD` | *(empty or redis password)* |
| `PROD_APP_KEY` | `base64:...` (generate with `php artisan key:generate`) |
| `PROD_STORAGE_BUCKET` | `revenge-browser-prod-apk` |

### Deployment Workflow

1. **Push to `dev-release`**
   ```bash
   git checkout dev-release
   git push origin dev-release
   ```
   → Auto-deploys to `dev.revengebrowser.com`

2. **Push to `main`**
   ```bash
   git checkout main
   git merge dev-release
   git push origin main
   ```
   → Auto-deploys to `revengebrowser.com` (with 10% canary)

### Manual Deployment

```bash
# Deploy to dev
./scripts/deploy-gcp.sh dev

# Deploy to production
./scripts/deploy-gcp.sh prod
```

### Health Check

After deployment, verify:

```bash
# Dev
curl https://dev.revengebrowser.com/api/health

# Production
curl https://revengebrowser.com/api/health
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

## 📡 API Documentation

### Public Endpoints

No authentication required.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/stats` | App statistics (download count) |
| `GET` | `/api/apk-info` | Current APK file information |
| `GET` | `/api/download` | Secure APK download (rate-limited: 5/min) |

### Admin Endpoints

Requires `Bearer <token>` via Laravel Sanctum.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Authenticate admin |
| `GET` | `/api/admin/me` | Current authenticated user |
| `POST` | `/api/admin/logout` | Logout |
| `POST` | `/api/admin/upload-apk` | Upload APK file (max 200MB) |
| `GET` | `/api/admin/apk-info` | Current APK metadata |
| `PUT` | `/api/admin/users/{id}` | Update user |
| `GET` | `/api/admin/team` | List team members |
| `POST` | `/api/admin/team` | Add team member |
| `DELETE` | `/api/admin/team/{id}` | Remove team member |

---

## 🎮 Admin Panel

### Features

- **Dashboard**
  - Overview stats (users, downloads, earnings)
  - APK Management (upload, view info)
  - System status indicators

- **Team Management**
  - Add/remove admins and moderators
  - Assign roles (Admin, Lead Moderator, Moderator)

- **Withdrawals**
  - View pending withdrawal requests
  - Approve/reject requests

- **Users**
  - Search and view all registered users
  - View wallet addresses and balances

- **Settings**
  - Configure withdrawal limits
  - Set P2E earning rates

### Access URLs

| Page | URL |
|------|-----|
| **Login** | `/admin/login` |
| **Dashboard** | `/admin/dashboard` |
| **Team** | `/admin/team` |
| **Withdrawals** | `/admin/withdrawals` |
| **Users** | `/admin/users` |
| **Settings** | `/admin/settings` |

---

## 🔧 Troubleshooting

### Local Development Issues

**Docker credential error**
```bash
# Fix Docker config
cat > ~/.docker/config.json << 'EOF'
{
    "auths": {}
}
EOF
```

**Port conflicts**
```bash
# Change port in .env
APP_PORT=8080

# Restart
./vendor/bin/sail down && ./vendor/bin/sail up -d
```

**Database connection issues**
```bash
# Restart PostgreSQL
./vendor/bin/sail restart pgsql

# Fresh migration
./vendor/bin/sail artisan migrate:fresh
```

**Clear all caches**
```bash
./vendor/bin/sail artisan optimize:clear
```

### Deployment Issues

**Build failures**
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure GCP_SA_KEY is valid base64

**Database connection errors**
```bash
# Check Cloud SQL instance status
gcloud sql instances list

# Verify connection string format
# /cloudsql/PROJECT:REGION:INSTANCE
```

**Health check fails**
```bash
# Check service logs
gcloud run services logs tail revenge-browser-prod --region=us-central1

# Verify service is running
gcloud run services list
```

### Common Errors

| Error | Solution |
|-------|----------|
| `413 Content Too Large` | PHP upload limit increased to 200MB in `docker/php.ini` |
| `SQL connection refused` | Check Cloud SQL instance is running and VPC connector configured |
| `Asset 404 errors` | Run `npm run build` before deployment |
| `Permission denied` | Check service account has correct IAM roles |

---

## 📝 Command Reference

### Docker / Sail Commands

```bash
# Start containers
./vendor/bin/sail up -d

# Stop containers
./vendor/bin/sail down

# View logs
./vendor/bin/sail logs -f

# Restart containers
./vendor/bin/sail restart

# Execute artisan
./vendor/bin/sail artisan <command>

# Execute composer
./vendor/bin/sail composer <command>

# Execute npm
./vendor/bin/sail npm <command>
```

### Artisan Commands

```bash
# Key operations
./vendor/bin/sail artisan key:generate

# Database
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan migrate:fresh
./vendor/bin/sail artisan db:seed

# Cache
./vendor/bin/sail artisan config:cache
./vendor/bin/sail artisan cache:clear
./vendor/bin/sail artisan optimize:clear

# Routes
./vendor/bin/sail artisan route:list

# Tinker
./vendor/bin/sail artisan tinker
```

### NPM Commands

```bash
# Install dependencies
./vendor/bin/sail npm install

# Development server
./vendor/bin/sail npm run dev

# Production build
./vendor/bin/sail npm run build
```

### Google Cloud Commands

```bash
# List services
gcloud run services list

# View logs
gcloud run services logs tail <service-name> --region=us-central1

# Describe service
gcloud run services describe <service-name> --region=us-central1

# SSH into container
gcloud run services execute <service-name> --region=us-central1

# List SQL instances
gcloud sql instances list

# Connect to database
gcloud sql connect <instance-name> --user=postgres
```

---

## 📁 Project Structure

```
revenge-browser-hq/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/
│   │   │   ├── AdminAuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── FileUploadController.php
│   │   │   └── TeamController.php
│   │   ├── DownloadController.php
│   │   └── HomeController.php
│   └── Models/
├── config/
│   └── filesystems.php          # APK disk configuration
├── deploy/
│   ├── dev.yaml                 # Dev environment config
│   └── production.yaml          # Production config
├── docker/
│   ├── nginx.conf               # Nginx configuration
│   ├── php-fpm.conf             # PHP-FPM configuration
│   └── php.ini                  # PHP configuration
├── public/
├── resources/
│   ├── css/
│   └── js/
│       ├── Components/
│       ├── Layouts/
│       └── Pages/
│           ├── Admin/
│           ├── Download.jsx
│           └── Home.jsx
├── routes/
│   └── web.php
├── scripts/
│   ├── deploy-gcp.sh            # Deployment script
│   └── setup-gcp.sh             # GCP setup script
├── storage/
│   └── app/apk/                 # APK storage directory
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD workflow
├── .gcloudignore
├── .env.example
├── .gitignore
├── compose.yaml                 # Docker Compose config
├── Dockerfile                   # Cloud Run container
├── DEPLOYMENT.md                # Deployment guide
└── DOCUMENTATION.md             # This file
```

---

## 🔐 Security Notes

1. **APK Uploads**
   - Maximum size: 200MB
   - Stored in secure disk (`storage/app/apk/`)
   - Original filename preserved
   - Tracked via `current-apk.json`

2. **Database Passwords**
   - Use strong, unique passwords
   - Rotate regularly
   - Never commit to repository

3. **API Keys**
   - Store in Google Secret Manager for production
   - Use environment-specific keys
   - Never share service account keys

4. **Rate Limiting**
   - Download endpoint: 5 requests per minute per IP
   - Prevents abuse and DDoS attacks

---

## 📊 Monitoring & Logging

### Cloud Run Logs

```bash
# Tail logs
gcloud run services logs tail revenge-browser-prod --region=us-central1

# View specific logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```

### Database Monitoring

```bash
# SQL instance info
gcloud sql instances describe revenge-browser-prod-db

# Backup status
gcloud sql backups list --instance=revenge-browser-prod-db
```

---

## 🔄 Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature
   # Make changes
   ./vendor/bin/sail npm run build
   git add .
   git commit -m "feat: add feature"
   ```

2. **Testing on Dev**
   ```bash
   git checkout dev-release
   git merge feature/your-feature
   git push origin dev-release
   # Test at dev.revengebrowser.com
   ```

3. **Deploy to Production**
   ```bash
   git checkout main
   git merge dev-release
   git push origin main
   # Deployed to revengebrowser.com
   ```

---

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/muftimehedi/revenge-browser-hq/issues
- Documentation: See `DEPLOYMENT.md` for detailed deployment guide

---

## 📄 License

[Your License Here]

---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
