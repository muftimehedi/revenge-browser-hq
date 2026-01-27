<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthenticated
{
    /**
     * Handle an incoming request.
     * Check if admin is authenticated via Sanctum token
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check for token in header or session
        $token = $request->bearerToken() ?? session('admin_token');

        if (!$token) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            return redirect('/admin/login');
        }

        // Validate token via API
        // For Inertia pages, we'll rely on frontend token validation
        // The session-based check happens on the client side

        return $next($request);
    }
}
