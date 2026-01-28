<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FileUploadController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\TeamController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Revenge Browser - Public Website & Admin Panel Routes
|
*/

// ============================================
// PUBLIC PAGES
// ============================================

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/download', [DownloadController::class, 'index'])->name('download');

// Public API
Route::get('/api/stats', [DownloadController::class, 'stats']);
Route::get('/api/apk-info', [DownloadController::class, 'apkInfo']);
Route::get('/api/download', [DownloadController::class, 'download']);

// ============================================
// ADMIN PANEL
// ============================================

Route::prefix('admin')->group(function () {
    // Auth routes (public)
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');

    // Admin pages (Inertia) - Auth is handled on frontend
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/withdrawals', [DashboardController::class, 'withdrawals'])->name('admin.withdrawals');
    Route::get('/users', [DashboardController::class, 'users'])->name('admin.users');
    Route::get('/settings', [DashboardController::class, 'settings'])->name('admin.settings');

    // Team Management (View)
    Route::get('/team', [TeamController::class, 'view'])->name('admin.team.view');
});

// Admin API routes
Route::prefix('api/admin')->group(function () {
    // Public auth routes
    Route::post('/login', [AdminAuthController::class, 'login']);

    // Protected routes - require Sanctum auth
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/upload-apk', [FileUploadController::class, 'uploadApk']);
        Route::get('/apk-info', [FileUploadController::class, 'getApkInfo']);
        Route::put('/users/{id}', [UsersController::class, 'update']);

        // Team Management (API)
        Route::get('/team', [TeamController::class, 'index']);
        Route::post('/team', [TeamController::class, 'store']);
        Route::delete('/team/{id}', [TeamController::class, 'destroy']);
    });
});
