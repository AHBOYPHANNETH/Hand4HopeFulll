<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;

class AdminDonationController extends Controller
{
    public function index()
    {
        return response()->json(
            Donation::where('status', 'paid')
                ->orderByDesc('paid_at')
                ->limit(100)
                ->get()
        );
    }
}
