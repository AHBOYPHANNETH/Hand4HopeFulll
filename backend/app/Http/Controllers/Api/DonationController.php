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

        $data['currency'] = $data['currency'] ?? 'USD';
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
            'currency' => ['required', 'in:USD,KHR'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        $accountId = (string) config('bakong.account_id');
        if ($accountId === '') {
            return response()->json([
                'message' => 'KHQR is not configured on the server. Set BAKONG_ACCOUNT_ID.',
            ], 503);
        }

        $instructionRef = strtoupper(Str::random(8));

        $donation = Donation::create([
            ...$data,
            'status' => 'pending',
        ]);

        $qr = KhqrBuilder::build([
            'bakongAccountId' => $accountId,
            'merchantName' => (string) config('bakong.merchant_name'),
            'merchantCity' => (string) config('bakong.merchant_city'),
            'merchantCategoryCode' => (string) config('bakong.merchant_category_code'),
            'amount' => (float) $data['amount'],
            'currency' => $data['currency'],
            'instructionRef' => $instructionRef,
            'storeLabel' => (string) config('bakong.store_label'),
            'terminalLabel' => (string) config('bakong.terminal_label'),
        ]);

        $donation->update([
            'qr_string' => $qr['qr'],
            'md5' => $qr['md5'],
        ]);

        return response()->json([
            'donation_id' => $donation->id,
            'qr' => $qr['qr'],
            'md5' => $qr['md5'],
            'amount' => (float) $donation->amount,
            'currency' => $donation->currency,
            'expires_in' => 5 * 60, // suggested poll window
        ], 201);
    }

    /**
     * Frontend polls this endpoint. We ask Bakong whether the QR has been paid;
     * on success we mark the donation paid + email a receipt (once).
     */
    public function khqrStatus(Donation $donation): JsonResponse
    {
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
