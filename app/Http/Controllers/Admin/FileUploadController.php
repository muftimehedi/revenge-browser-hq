<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
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
     * Set the current APK filename
     */
    private function setCurrentApkFilename(string $filename): void
    {
        $dir = dirname($this->currentApkFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($this->currentApkFile, json_encode(['filename' => $filename]));
    }

    /**
     * Upload APK file
     */
    public function uploadApk(Request $request)
    {
        $request->validate([
            'apk' => 'required|file|max:204800|mimes:apk', // Max 200MB
        ]);

        if ($request->hasFile('apk')) {
            $file = $request->file('apk');
            $filename = $file->getClientOriginalName();

            // Delete old APK if exists
            $oldFilename = $this->getCurrentApkFilename();
            if ($oldFilename && Storage::disk('apk')->exists($oldFilename)) {
                Storage::disk('apk')->delete($oldFilename);
            }

            // Store new APK with original filename
            $file->storeAs('', $filename, 'apk');

            // Update current APK pointer
            $this->setCurrentApkFilename($filename);

            return response()->json([
                'success' => true,
                'message' => 'APK uploaded successfully',
                'filename' => $filename,
                'size' => $file->getSize()
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded'
        ], 400);
    }

    /**
     * Get current APK info
     */
    public function getApkInfo()
    {
        $filename = $this->getCurrentApkFilename();

        if ($filename && Storage::disk('apk')->exists($filename)) {
            $size = Storage::disk('apk')->size($filename);
            $lastModified = Storage::disk('apk')->lastModified($filename);

            return response()->json([
                'success' => true,
                'exists' => true,
                'filename' => $filename,
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
}
