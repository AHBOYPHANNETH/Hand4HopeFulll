<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
        ]);

        $user = $request->user();

        $this->deleteLocalAvatarIfExists($user->avatar_url);

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar_url' => asset('storage/'.$path)]);

        return response()->json($this->profilePayload($request));
    }

    public function removeAvatar(Request $request)
    {
        $user = $request->user();

        $this->deleteLocalAvatarIfExists($user->avatar_url);

        $user->update(['avatar_url' => null]);

        return response()->json($this->profilePayload($request));
    }

    private function deleteLocalAvatarIfExists(?string $avatarUrl): void
    {
        if (! $avatarUrl || ! str_contains($avatarUrl, '/storage/avatars/')) {
            return;
        }

        $relative = 'avatars/'.basename(parse_url($avatarUrl, PHP_URL_PATH));
        Storage::disk('public')->delete($relative);
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
