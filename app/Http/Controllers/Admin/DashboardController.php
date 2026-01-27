<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show admin dashboard
     */
    public function index()
    {
        $stats = DB::table('app_stats')->where('app_name', 'revenge_browser')->first();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => 0,
                'totalEarned' => 0.00,
                'pendingWithdrawals' => 0,
                'pendingAmount' => 0.00,
                'totalDownloads' => $stats ? $stats->download_count : 0,
            ]
        ]);
    }

    /**
     * Show withdrawals page
     */
    public function withdrawals()
    {
        return Inertia::render('Admin/Withdrawals', [
            'withdrawals' => []
        ]);
    }

    /**
     * Show users page
     */
    public function users()
    {
        $users = \App\Models\User::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    /**
     * Show settings page
     */
    public function settings()
    {
        return Inertia::render('Admin/Settings');
    }
}
