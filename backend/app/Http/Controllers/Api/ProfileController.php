<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($this->profilePayload($request));
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:255'],
            'is_profile_public' => ['sometimes', 'boolean'],
            'email_notifications' => ['sometimes', 'boolean'],
        ]);

        $user = $request->user();
        $user->update($data);

        return response()->json($this->profilePayload($request));
    }

    private function profilePayload(Request $request): array
    {
        return $request->user()->only([
            'id',
            'name',
            'email',
            'provider',
            'role',
            'avatar_url',
            'phone',
            'address',
            'is_profile_public',
            'email_notifications',
        ]);
    }
}
