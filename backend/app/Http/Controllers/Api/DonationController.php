<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\DonationReceived;
use App\Models\Donation;
use App\Services\Bakong\BakongClient;
use App\Services\Bakong\KhqrBuilder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    /** Legacy endpoint — still works for offline/manual donations. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'amount' => ['required', 'numeric', 'min:1'],
            'currency' => ['nullable', 'string', 'max:8'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        $data['currency'] = $data['currency'] ?? (string) config('bakong.currency');
        $data['status'] = 'paid';
        $data['paid_at'] = now();

        $donation = Donation::create($data);
        $this->sendReceipt($donation);

        return response()->json([
            'message' => 'Thank you for supporting Hand4Hope.',
            'donation' => $donation->only(['id', 'amount', 'currency']),
        ], 201);
    }

    /**
     * Start a KHQR donation: persist a pending row, generate the QR, return it.
     */
    public function initiateKhqr(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['nullable', 'in:USD,KHR'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        $data['currency'] = $data['currency'] ?? (string) config('bakong.currency');

        $merchantId = (string) config('bakong.merchant_id');
        if ($merchantId === '') {
            return response()->json([
                'message' => 'KHQR is not configured on the server. Set BAKONG_MERCHANT_ID.',
            ], 503);
        }

        $expiryMinutes = max(1, (int) config('bakong.intent_expiry_minutes'));
        $expiresAt = now()->addMinutes($expiryMinutes);
        $instructionRef = strtoupper(Str::random(8));

        $donation = Donation::create([
            ...$data,
            'status' => 'pending',
            'expires_at' => $expiresAt,
        ]);

        $qr = KhqrBuilder::build([
            'bakongAccountId' => $merchantId,
            'merchantName' => (string) config('bakong.merchant_name'),
            'merchantCity' => (string) config('bakong.merchant_city'),
            'merchantCategoryCode' => (string) config('bakong.merchant_category_code'),
            'amount' => (float) $data['amount'],
            'currency' => $data['currency'],
            'instructionRef' => $instructionRef,
            'storeLabel' => (string) config('bakong.store_label'),
            'terminalLabel' => (string) config('bakong.terminal_label'),
        ]);

        $deeplink = BakongClient::fromConfig()->generateDeeplinkByQr(
            $qr['qr'],
            (string) config('bakong.app_name'),
            (string) config('bakong.app_icon_url'),
            (string) config('bakong.app_callback_url'),
        );

        $donation->update([
            'qr_string' => $qr['qr'],
            'md5' => $qr['md5'],
            'deeplink' => $deeplink,
        ]);

        return response()->json([
            'donation_id' => $donation->id,
            'qr' => $qr['qr'],
            'md5' => $qr['md5'],
            'deeplink' => $deeplink,
            'amount' => (float) $donation->amount,
            'currency' => $donation->currency,
            'expires_at' => $expiresAt->toIso8601String(),
            'expires_in' => $expiryMinutes * 60,
        ], 201);
    }

    /**
     * Frontend polls this endpoint. We ask Bakong whether the QR has been paid;
     * on success we mark the donation paid + email a receipt (once).
     */
    public function khqrStatus(Donation $donation): JsonResponse
    {
        if ($donation->isExpired()) {
            $donation->update(['status' => 'expired']);
        }

        if ($donation->status === 'pending' && $donation->md5) {
            $bakong = BakongClient::fromConfig();
            $resp = $bakong->checkTransactionByMd5($donation->md5);

            if ($resp && (int) ($resp['responseCode'] ?? -1) === 0 && !empty($resp['data'])) {
                $donation->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                    'bakong_hash' => $resp['data']['hash'] ?? null,
                ]);
                $this->sendReceipt($donation);
            }
        }

        return response()->json([
            'status' => $donation->status,
            'paid_at' => $donation->paid_at?->toIso8601String(),
            'expires_at' => $donation->expires_at?->toIso8601String(),
            'amount' => (float) $donation->amount,
            'currency' => $donation->currency,
        ]);
    }

    private function sendReceipt(Donation $donation): void
    {
        Mail::to($donation->email)->send(new DonationReceived($donation));

        $admin = config('mail.admin_address');
        if ($admin) {
            Mail::to($admin)->send(new DonationReceived($donation, isAdminCopy: true));
        }
    }
}
