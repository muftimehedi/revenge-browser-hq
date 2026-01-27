<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    /**
     * Upload APK file
     */
    public function uploadApk(Request $request)
    {
        $request->validate([
            'apk' => 'required|file|max:204800', // Max 200MB
        ]);

        if ($request->hasFile('apk')) {
            $file = $request->file('apk');

            // Delete old APK if exists
            if (Storage::disk('apk')->exists('revenge-browser-v1.apk')) {
                Storage::disk('apk')->delete('revenge-browser-v1.apk');
            }

            // Store new APK
            $file->storeAs('', 'revenge-browser-v1.apk', 'apk');

            return response()->json([
                'success' => true,
                'message' => 'APK uploaded successfully',
                'filename' => 'revenge-browser-v1.apk',
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
        if (Storage::disk('apk')->exists('revenge-browser-v1.apk')) {
            return response()->json([
                'success' => true,
                'exists' => true,
                'filename' => 'revenge-browser-v1.apk',
                'size' => Storage::disk('apk')->size('revenge-browser-v1.apk'),
                'lastModified' => Storage::disk('apk')->lastModified('revenge-browser-v1.apk')
            ]);
        }

        return response()->json([
            'success' => true,
            'exists' => false
        ]);
    }
}
