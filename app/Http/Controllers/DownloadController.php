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
    private string $currentApkFile;

    public function __construct()
    {
        $this->currentApkFile = storage_path('app/apk/current-apk.json');
    }

    /**
     * Get the current APK filename
     */
    private function getCurrentApkFilename(): ?string
    {
        if (!file_exists($this->currentApkFile)) {
            return null;
        }

        $data = json_decode(file_get_contents($this->currentApkFile), true);
        return $data['filename'] ?? null;
    }

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
     * Get APK file information (public endpoint)
     */
    public function apkInfo()
    {
        $filename = $this->getCurrentApkFilename();

        if ($filename && Storage::disk('apk')->exists($filename)) {
            $size = Storage::disk('apk')->size($filename);
            $lastModified = Storage::disk('apk')->lastModified($filename);

            return response()->json([
                'success' => true,
                'exists' => true,
                'filename' => $filename,
                'version' => 'v1.0',
                'size' => $size,
                'sizeHuman' => $this->formatBytes($size),
                'lastModified' => $lastModified,
                'lastModifiedHuman' => date('F j, Y', $lastModified)
            ]);
        }

        return response()->json([
            'success' => true,
            'exists' => false
        ]);
    }

    /**
     * Format bytes to human readable format
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
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

        // Get current APK filename
        $filename = $this->getCurrentApkFilename();

        if (!$filename || !Storage::disk('apk')->exists($filename)) {
            return response()->json(['error' => 'File not found.'], 404);
        }

        // Atomically increment download count
        DB::table('app_stats')
            ->where('app_name', 'revenge_browser')
            ->increment('download_count');

        return Storage::disk('apk')->download($filename, $filename);
    }
}
