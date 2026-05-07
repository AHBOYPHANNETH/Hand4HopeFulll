<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();

        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            if (! $user->provider || $user->provider === 'google') {
                $user->update([
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'name' => $user->name ?: $googleUser->getName(),
                    'avatar_url' => $googleUser->getAvatar() ?: $user->avatar_url,
                ]);
            }
        } else {
            $user = User::create([
                'name' => $googleUser->getName() ?: 'Volunteer',
                'email' => $googleUser->getEmail(),
                'password' => Hash::make(Str::random(32)),
                'provider' => 'google',
                'provider_id' => $googleUser->getId(),
                'role' => 'user',
                'avatar_url' => $googleUser->getAvatar(),
            ]);
        }

        $token = $user->createToken('auth')->plainTextToken;
        $frontend = rtrim(config('app.frontend_url'), '/');
        $payload = base64_encode(json_encode($user->only([
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
        ])));

        $url = $frontend.'/auth/google/callback?token='.rawurlencode($token).'&user='.rawurlencode($payload);

        return redirect()->away($url);
    }
}
