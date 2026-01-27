<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class DownloadController extends Controller
{
    /**
     * Display the download page
     */
    public function index()
    {
        $stats = DB::table('app_stats')->where('app_name', 'revenge_browser')->first();

        return Inertia::render('Download', [
            'downloadCount' => $stats ? $stats->download_count : 0
        ]);
    }

    /**
     * Get download stats as JSON (API endpoint)
     */
    public function stats()
    {
        $stats = DB::table('app_stats')->where('app_name', 'revenge_browser')->first();

        return response()->json([
            'success' => true,
            'download_count' => $stats ? $stats->download_count : 0
        ]);
    }

    /**
     * Handle the APK file download with rate limiting
     * Rate Limit: 5 requests per minute per IP (spam protection)
     */
    public function download(Request $request)
    {
        $ip = $request->ip();
        $key = 'download-limit:' . $ip;

        // Rate limiting: 5 requests per minute per IP
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'error' => 'Too many download attempts. Please try again in ' . $seconds . ' seconds.'
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }

        RateLimiter::hit($key, 60);

        // Check APK file exists using the apk disk
        if (!Storage::disk('apk')->exists('revenge-browser-v1.apk')) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        // Atomically increment download count
        DB::table('app_stats')
            ->where('app_name', 'revenge_browser')
            ->increment('download_count');

        return Storage::disk('apk')->download('revenge-browser-v1.apk', 'revenge-browser-v1.apk');
    }
}
