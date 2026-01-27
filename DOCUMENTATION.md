# Revenge Browser Project Documentation

## 🚀 Project Overview

**Revenge Browser** is a privacy-focused, gaming-optimized Android browser with a "Play-to-Earn" (P2E) ecosystem. This project consists of a modern landing page for user acquisition and a robust Admin Panel for managing the P2E economy, users, and APK releases.

### Tech Stack

- **Framework**: Laravel 12 (PHP)
- **Frontend**: Inertia.js + React
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Database**: PostgreSQL (Running via Docker/Laravel Sail)
- **Authentication**: Laravel Sanctum (API Token Auth)

---

## 🛠️ Installation & Setup (From Scratch)

### Prerequisites

- PHP 8.4+
- Node.js 18+
- Composer
- PostgreSQL (or Docker Desktop for Sail)

### Step-by-Step Installation

1.  **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd revenge-browser-hq
    ```

2.  **Install PHP Dependencies**

    ```bash
    composer install
    ```

3.  **Install JavaScript Dependencies**

    ```bash
    npm install
    ```

4.  **Environment Setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    _Note: Configure `DB_CONNECTION=pgsql` and set credentials (default User: `sail`, Pass: `password` if using Sail/Docker)._

5.  **Database Migration & Seeding**
    Creates tables (users, stats, withdrawals) and default admin user.

    ```bash
    # Create DB if not exists (using Sail/Docker credentials)
    # createdb -h 127.0.0.1 -U sail -W revenge_browser

    php artisan migrate
    # Create Admin User (Seeded manually or via Tinker)
    php artisan tinker --execute="DB::table('admin_users')->insert(['name'=>'Admin', 'email'=>'admin@revenge.com', 'password'=>bcrypt('password123'), 'role'=>'admin', 'created_at'=>now(), 'updated_at'=>now()]);"
    ```

6.  **Create Storage Links**
    Crucial for APK downloads to work publicly.

    ```bash
    php artisan storage:link
    ```

7.  **Run Development Servers**
    You need two terminals running:

    _Terminal 1 (Backend):_

    ```bash
    php artisan serve --port=8002
    ```

    _Terminal 2 (Frontend):_

    ```bash
    npm run dev
    ```

    **Access the Site:** [http://localhost:8002](http://localhost:8002)

---

## 🔑 Admin Credentials & Access

**Login URL**: [http://localhost:8002/admin/login](http://localhost:8002/admin/login)

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

### Public Pages

| Page         | URL                                                              | Description                  |
| ------------ | ---------------------------------------------------------------- | ---------------------------- |
| **Home**     | [http://localhost:8002/](http://localhost:8002/)                 | Landing page with new design |
| **Download** | [http://localhost:8002/download](http://localhost:8002/download) | Download page with counter   |
| **About**    | [http://localhost:8002/about](http://localhost:8002/about)       | About/Story page             |

### Admin Panel

**Credentials**: `admin@revenge.com` / `password123`

| Page            | URL                                                                                |
| --------------- | ---------------------------------------------------------------------------------- |
| **Login**       | [http://localhost:8002/admin/login](http://localhost:8002/admin/login)             |
| **Dashboard**   | [http://localhost:8002/admin/dashboard](http://localhost:8002/admin/dashboard)     |
| **Team**        | [http://localhost:8002/admin/team](http://localhost:8002/admin/team)               |
| **Withdrawals** | [http://localhost:8002/admin/withdrawals](http://localhost:8002/admin/withdrawals) |
| **Users**       | [http://localhost:8002/admin/users](http://localhost:8002/admin/users)             |
| **Settings**    | [http://localhost:8002/admin/settings](http://localhost:8002/admin/settings)       |

### API Endpoints

| Type       | Method | Endpoint                                     | Note                         |
| ---------- | ------ | -------------------------------------------- | ---------------------------- |
| **Public** | `GET`  | `http://localhost:8002/api/stats`            | JSON stats                   |
| **Public** | `GET`  | `http://localhost:8002/api/download`         | File download                |
| **Admin**  | `GET`  | `http://localhost:8002/api/admin/apk-info`   | APK Metadata (Auth required) |
| **Admin**  | `POST` | `http://localhost:8002/api/admin/upload-apk` | Upload APK (Auth required)   |
