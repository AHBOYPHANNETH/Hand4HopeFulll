<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => 'user',
        ]);

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'provider',
                'avatar_url',
                'phone',
                'address',
                'is_profile_public',
                'email_notifications',
            ]),
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! $user->password || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $token = $user->createToken('auth')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->only([
                'id',
                'name',
                'email',
                'role',
                'provider',
                'avatar_url',
                'phone',
                'address',
                'is_profile_public',
                'email_notifications',
            ]),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user()->only([
            'id',
            'name',
            'email',
            'role',
            'provider',
            'avatar_url',
            'phone',
            'address',
            'is_profile_public',
            'email_notifications',
        ]));
    }
}
