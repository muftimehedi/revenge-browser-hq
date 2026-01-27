<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page
     */
    public function index()
    {
        $stats = DB::table('app_stats')->where('app_name', 'revenge_browser')->first();

        return Inertia::render('Home', [
            'downloadCount' => $stats ? $stats->download_count : 0
        ]);
    }

    /**
     * Display the about page
     */
    public function about()
    {
        return Inertia::render('About');
    }
}
