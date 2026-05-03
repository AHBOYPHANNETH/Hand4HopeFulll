<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\DonationReceived;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class DonationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'amount' => ['required', 'numeric', 'min:1'],
            'currency' => ['nullable', 'string', 'max:8'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        $data['currency'] = $data['currency'] ?? 'USD';

        $donation = Donation::create($data);

        Mail::to($donation->email)->send(new DonationReceived($donation));

        $admin = config('mail.admin_address');
        if ($admin) {
            Mail::to($admin)->send(new DonationReceived($donation, isAdminCopy: true));
        }

        return response()->json([
            'message' => 'Thank you for supporting Hand4Hope.',
            'donation' => $donation->only(['id', 'amount', 'currency']),
        ], 201);
    }
}
