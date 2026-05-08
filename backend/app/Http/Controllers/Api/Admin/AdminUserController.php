<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));
        $role = $request->query('role');

        $query = User::query()
            ->select([
                'id',
                'name',
                'email',
                'role',
                'provider',
                'avatar_url',
                'phone',
                'address',
                'email_notifications',
                'is_profile_public',
                'email_verified_at',
                'created_at',
                'updated_at',
            ])
            ->withCount([
                'volunteeredEvents as volunteer_requests_count',
                'volunteeredEvents as volunteer_approved_count' => function ($q) {
                    $q->where('event_volunteers.status', 'approved');
                },
            ])
            ->orderByDesc('created_at');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (in_array($role, ['admin', 'user'], true)) {
            $query->where('role', $role);
        }

        return response()->json($query->limit(200)->get());
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['sometimes', 'in:admin,user'],
            'phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:255'],
            'email_notifications' => ['sometimes', 'boolean'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        // Prevent the current admin from demoting themselves and locking everyone out.
        if (
            isset($data['role'])
            && $data['role'] !== 'admin'
            && $request->user()->id === $user->id
        ) {
            return response()->json([
                'message' => 'You cannot change your own admin role.',
            ], 422);
        }

        if (array_key_exists('password', $data)) {
            if ($data['password']) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }
        }

        $user->fill($data)->save();

        return response()->json([
            'message' => 'User updated.',
            'user' => $user->fresh(),
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        DB::transaction(function () use ($user): void {
            DB::table('event_volunteers')->where('user_id', $user->id)->delete();
            $user->notifications()->delete();
            $user->tokens()->delete();
            $user->delete();
        });

        return response()->json(['message' => 'User deleted.']);
    }
}
