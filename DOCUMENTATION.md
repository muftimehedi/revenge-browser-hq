# Revenge Browser Project Documentation

## 🚀 Project Overview

**Revenge Browser** is a privacy-focused, gaming-optimized Android browser with a "Play-to-Earn" (P2E) ecosystem. This project consists of a modern landing page for user acquisition and a robust Admin Panel for managing the P2E economy, users, and APK releases.

# Revenge Browser HQ

### Tech Stack

- **Framework**: Laravel 12 (PHP 8.4)
- **Frontend**: Inertia.js + React
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Database**: PostgreSQL 18
- **Cache/Queue**: Redis
- **Email Testing**: Mailpit
- **Authentication**: Laravel Sanctum (API Token Auth)
- **Development Environment**: Docker + Laravel Sail

---

## 🛠️ Installation & Setup (Using Laravel Sail 🐳)

This project relies on **Laravel Sail** for a consistent Docker-based development environment.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- **Git**

### Step-by-Step Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd revenge-browser-hq
   ```

2. **Install Dependencies**

   If you don't have PHP/Composer installed locally, use a Docker container:

   ```bash
   docker run --rm \
       -u "$(id -u):$(id -g)" \
       -v "$(pwd):/var/www/html" \
       -w /var/www/html \
       laravelsail/php84-composer:latest \
       composer install --ignore-platform-reqs
   ```

   Or if you have PHP & Composer locally:

   ```bash
   composer install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   The `.env.example` is already configured for Sail:
   ```ini
   DB_CONNECTION=pgsql
   DB_HOST=pgsql
   DB_PORT=5432
   REDIS_HOST=redis
   MAIL_HOST=mailpit
   ```

4. **Start Sail & Build Containers**

   ```bash
   ./vendor/bin/sail up -d --build
   ```

5. **Generate APP_KEY & Run Migrations**

   ```bash
   ./vendor/bin/sail artisan key:generate
   ./vendor/bin/sail artisan migrate --force
   ./vendor/bin/sail artisan storage:link
   ```

6. **Install & Build Frontend**

   ```bash
   ./vendor/bin/sail npm install
   ./vendor/bin/sail npm run build
   ```

   **Access the Site:** [http://localhost](http://localhost)

---

## 🐳 Docker & Sail Commands Reference

### Sail Commands (Recommended)

```bash
# Start all containers in detached mode
./vendor/bin/sail up -d

# Start with build (rebuild images)
./vendor/bin/sail up -d --build

# Stop all containers
./vendor/bin/sail down

# Stop and remove volumes (reset database)
./vendor/bin/sail down -v

# View container logs
./vendor/bin/sail logs

# Follow logs (real-time)
./vendor/bin/sail logs -f

# View logs for specific service
./vendor/bin/sail logs -f laravel.test
./vendor/bin/sail logs -f pgsql

# Restart containers
./vendor/bin/sail restart

# Execute artisan commands
./vendor/bin/sail artisan <command>

# Execute composer commands
./vendor/bin/sail composer <command>

# Execute npm commands
./vendor/bin/sail npm <command>

# Open shell in container
./vendor/bin/sail shell

# Run one-off commands
./vendor/bin/sail php --version
./vendor/bin/sail python --version
```

### Docker Compose Commands (Alternative)

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View running containers
docker compose ps

# View logs
docker compose logs -f

# Execute command in container
docker compose exec laravel.test <command>

# Rebuild containers
docker compose up -d --build

# Run artisan
docker compose exec laravel.test php artisan <command>

# Run npm
docker compose exec laravel.test npm <command>

# Open shell
docker compose exec laravel.test bash
```

### Container Status & Info

```bash
# List all running containers
docker compose ps

# View container resource usage
docker compose stats

# Inspect container details
docker inspect <container-id>
```

---

## 🔧 Troubleshooting

### Docker Credential Helper Error

If you encounter `docker-credential-desktop: executable file not found`:

```bash
# Fix Docker credential configuration
cat > ~/.docker/config.json << 'EOF'
{
    "auths": {}
}
EOF
```

Then restart Docker Desktop and retry.

### NPM Platform-Specific Dependencies

If you get Rollup/ARM64 errors after moving between platforms:

```bash
# Rebuild node_modules inside container
docker compose exec laravel.test sh -c "rm -rf node_modules package-lock.json && npm install && npm run build"
```

### Port Conflicts

If port 80 is already in use, change `APP_PORT` in `.env`:

```ini
APP_PORT=8080
```

Then restart: `./vendor/bin/sail down && ./vendor/bin/sail up -d`

### Database Connection Issues

```bash
# Restart PostgreSQL container
docker compose restart pgsql

# Check PostgreSQL logs
./vendor/bin/sail logs -f pgsql

# Fresh migration (WARNING: deletes data)
./vendor/bin/sail artisan migrate:fresh
```

### Clear All Caches

```bash
# Clear application cache
./vendor/bin/sail artisan cache:clear

# Clear config cache
./vendor/bin/sail artisan config:clear

# Clear route cache
./vendor/bin/sail artisan route:clear

# Clear view cache
./vendor/bin/sail artisan view:clear

# Clear all caches at once
./vendor/bin/sail artisan optimize:clear
```

---

## 🔑 Admin Credentials & Access

**Login URL**: [http://localhost/admin/login](http://localhost/admin/login)

| Role            | Email               | Password      |
| --------------- | ------------------- | ------------- |
| **Super Admin** | `admin@revenge.com` | `password123` |

---

## 🎮 Features Module

### 1. Public Website

- **Home Page**: Premium "Cyberpunk" design with floating 3D animations and glassmorphism cards.
- **Download System**: Secure, rate-limited download endpoint that tracks stats.
- **Live Stats**: Displays real-time download counts without page refreshes.

### 2. Admin Panel

- **Dashboard**:
    - Overview of **Total Users**, **Website Downloads**, **Total Earned**, and **Pending Withdrawals**.
    - APK Management (Upload/Delete/View Info).
    - System Status (API/Blockchain connectivity).
- **Team Management**:
    - Add/Remove Admin and Moderator accounts.
    - Assign roles (Admin, Lead Moderator, Moderator).
- **Withdrawals**:
    - List of user withdrawal requests.
    - Approve/Reject actions.
- **Users**:
    - Searchable list of all registered users (P2E players).
    - View wallet addresses and balances.
- **Settings**:
    - Configure withdrawal limits (Min/Max).
    - Set P2E earning rates (Points per minute).

---

## 📡 API Documentation

### Public Endpoints

No authentication required.

| Method | Endpoint        | Description                                          |
| ------ | --------------- | ---------------------------------------------------- |
| `GET`  | `/api/stats`    | Returns app statistics (download count/users).       |
| `GET`  | `/api/download` | Initiates secure APK download. Rate-limited (5/min). |

### Admin Endpoints

Requires `Bearer <token>` (Handled via Sanitized Cookie/Session).

| Method | Endpoint                | Description                              |
| ------ | ----------------------- | ---------------------------------------- |
| `POST` | `/api/admin/login`      | Authenticates admin and returns token.   |
| `POST` | `/api/admin/upload-apk` | Uploads new APK file (Max 100MB).        |
| `GET`  | `/api/admin/apk-info`   | Returns metadata of current APK.         |
| `GET`  | `/api/admin/me`         | Returns current authenticated user info. |
| `GET`  | `/api/admin/team`       | List team members.                       |
| `POST` | `/api/admin/team`       | Add new team member.                     |

---

## 📁 Folder Structure Key Items

```
revenge-browser-hq/
├── app/
│   ├── Http/Controllers/Admin/  # Admin Logic (Dashboard, Auth, Uploads)
│   ├── Http/Middleware/         # Custom Auth Middleware
│   └── Models/                  # Database Models
├── config/
│   └── filesystems.php          # Custom 'apk' disk configuration
├── resources/
│   ├── css/app.css              # Custom Animations & Variables
│   └── js/
│       ├── Layouts/             # AdminLayout & PublicLayout
│       └── Pages/               # React Views (Home, Admin/*)
└── routes/
    └── web.php                  # All Route definitions
```

## ⚠️ Important Configuration Notes

1.  **APK Storage Driver**:
    A custom disk `apk` is configured in `config/filesystems.php`. Files are stored in `storage/app/apk/`. This is separate from public uploads for security.

2.  **CSRF Configuration**:
    API routes (`api/*`) are excluded from strict CSRF verification in `bootstrap/app.php` to allow for token-based authentication flows if needed, though the frontend primarily uses stateful cookies.

---

## 🌐 URL Reference

### Service Ports

| Service  | Port | URL                                    | Description             |
| -------- | ---- | -------------------------------------- | ----------------------- |
| **App**  | 80   | http://localhost                       | Laravel Application     |
| **Vite** | 5173 | http://localhost:5173                  | Dev Server (hot reload) |
| **Redis** | 6379 | localhost:6379                         | Cache/Queue             |
| **PostgreSQL** | 5432 | localhost:5432             | Database                |
| **Mailpit** | 1025 | localhost:1025                  | SMTP Server             |
| **Mailpit Dashboard** | 8025 | http://localhost:8025 | Email Testing UI        |

### Public Pages

| Page         | URL                                                       | Description                  |
| ------------ | --------------------------------------------------------- | ---------------------------- |
| **Home**     | [http://localhost/](http://localhost/)                     | Landing page with new design |
| **Download** | [http://localhost/download](http://localhost/download)     | Download page with counter   |
| **About**    | [http://localhost/about](http://localhost/about)           | About/Story page             |

### Admin Panel

**Credentials**: `admin@revenge.com` / `password123`

| Page            | URL                                                                      |
| --------------- | ------------------------------------------------------------------------ |
| **Login**       | [http://localhost/admin/login](http://localhost/admin/login)             |
| **Dashboard**   | [http://localhost/admin/dashboard](http://localhost/admin/dashboard)     |
| **Team**        | [http://localhost/admin/team](http://localhost/admin/team)               |
| **Withdrawals** | [http://localhost/admin/withdrawals](http://localhost/admin/withdrawals) |
| **Users**       | [http://localhost/admin/users](http://localhost/admin/users)             |
| **Settings**    | [http://localhost/admin/settings](http://localhost/admin/settings)       |

### API Endpoints

| Type       | Method | Endpoint                                | Note                         |
| ---------- | ------ | --------------------------------------- | ---------------------------- |
| **Public** | `GET`  | `http://localhost/api/stats`            | JSON stats                   |
| **Public** | `GET`  | `http://localhost/api/download`         | File download                |
| **Admin**  | `GET`  | `http://localhost/api/admin/apk-info`   | APK Metadata (Auth required) |
| **Admin**  | `POST` | `http://localhost/api/admin/upload-apk` | Upload APK (Auth required)   |

---

## 📝 Quick Command Reference

```bash
# ──────────────────────────────────────────────────────────
# PROJECT MANAGEMENT
# ──────────────────────────────────────────────────────────

# Start project
./vendor/bin/sail up -d

# Stop project
./vendor/bin/sail down

# Restart project
./vendor/bin/sail restart

# View logs
./vendor/bin/sail logs -f

# ──────────────────────────────────────────────────────────
# LARAVEL ARTISAN COMMANDS
# ──────────────────────────────────────────────────────────

# Generate application key
./vendor/bin/sail artisan key:generate

# Run migrations
./vendor/bin/sail artisan migrate

# Run migrations with force (production)
./vendor/bin/sail artisan migrate --force

# Fresh migration (reset database)
./vendor/bin/sail artisan migrate:fresh

# Create migration
./vendor/bin/sail artisan make:migration <name>

# Create controller
./vendor/bin/sail artisan make:controller <name>

# Create model
./vendor/bin/sail artisan make:model <name>

# Create seeder
./vendor/bin/sail artisan make:seeder <name>

# Run seeders
./vendor/bin/sail artisan db:seed

# Cache configuration
./vendor/bin/sail artisan config:cache

# Clear all caches
./vendor/bin/sail artisan optimize:clear

# Create storage link
./vendor/bin/sail artisan storage:link

# List all routes
./vendor/bin/sail artisan route:list

# Tinker (interactive console)
./vendor/bin/sail artisan tinker

# ──────────────────────────────────────────────────────────
# NPM / FRONTEND COMMANDS
# ──────────────────────────────────────────────────────────

# Install dependencies
./vendor/bin/sail npm install

# Run dev server (with hot reload)
./vendor/bin/sail npm run dev

# Build for production
./vendor/bin/sail npm run build

# Add package
./vendor/bin/sail npm add <package>

# Remove package
./vendor/bin/sail npm remove <package>

# ──────────────────────────────────────────────────────────
# COMPOSER COMMANDS
# ──────────────────────────────────────────────────────────

# Install packages
./vendor/bin/sail composer install

# Update packages
./vendor/bin/sail composer update

# Add package
./vendor/bin/sail composer require <package>

# Remove package
./vendor/bin/sail composer remove <package>

# Dump autoload
./vendor/bin/sail composer dump-autoload

# ──────────────────────────────────────────────────────────
# DOCKER COMPOSE DIRECT COMMANDS
# ──────────────────────────────────────────────────────────

# View container status
docker compose ps

# Execute shell in container
docker compose exec laravel.test bash

# View logs for all services
docker compose logs -f

# View logs for specific service
docker compose logs -f laravel.test
docker compose logs -f pgsql
docker compose logs -f redis

# Rebuild containers
docker compose up -d --build

# Stop and remove everything (including volumes)
docker compose down -v
```
