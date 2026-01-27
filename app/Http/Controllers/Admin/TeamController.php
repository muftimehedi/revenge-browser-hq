<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Render the Inertia View
     */
    public function view()
    {
        return Inertia::render('Admin/Team');
    }

    /**
     * API: List team members
     */
    public function index()
    {
        $team = AdminUser::orderBy('role', 'asc')->orderBy('created_at', 'desc')->get();
        return response()->json($team);
    }

    /**
     * API: Store a newly created team member
     */
    public function store(Request $request)
    {
        $creator = $request->user(); // Works because auth:sanctum middleware

        // Validate basic fields
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admin_users',
            'password' => 'required|string|min:8',
            'role' => ['required', Rule::in([AdminUser::ROLE_ADMIN, AdminUser::ROLE_LEAD_MODERATOR, AdminUser::ROLE_MODERATOR])],
        ]);

        // Enforce Permissions
        if ($creator->isAdmin()) {
            // Admin can create any role (including other admins)
        } elseif ($creator->isLeadModerator()) {
            // Lead can only create moderator
            if ($validated['role'] !== AdminUser::ROLE_MODERATOR) {
                return response()->json(['message' => 'Lead Moderators can only create Moderators.'], 403);
            }
        } elseif ($creator->isModerator()) {
            return response()->json(['message' => 'Moderators cannot create users.'], 403);
        }

        $user = AdminUser::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Team member created successfully.',
            'user' => $user
        ]);
    }

    /**
     * API: Remove the specified team member
     */
    public function destroy(string $id)
    {
        $deleter = request()->user();
        $target = AdminUser::findOrFail($id);

        // Permissions for deletion
        if ($deleter->id === $target->id) {
            return response()->json(['message' => 'You cannot delete yourself.'], 403);
        }

        if ($deleter->isAdmin()) {
            // Admin can delete anyone
            $target->delete();
        } elseif ($deleter->isLeadModerator()) {
            // Lead Mod can only delete Moderators
            if ($target->isModerator()) {
                $target->delete();
            } else {
                return response()->json(['message' => 'You can only delete Moderators.'], 403);
            }
        } else {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        return response()->json(['success' => true, 'message' => 'Team member removed.']);
    }
}
