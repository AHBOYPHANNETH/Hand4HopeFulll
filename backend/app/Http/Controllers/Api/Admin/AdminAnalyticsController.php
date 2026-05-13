<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Donation;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'events_count' => Event::count(),
            'donations_count' => Donation::where('status', 'paid')->count(),
            'donations_total_amount' => (float) Donation::where('status', 'paid')->sum('amount'),
            'contacts_count' => Contact::count(),
            'volunteer_signups_count' => (int) DB::table('event_volunteers')->count(),
            'users_count' => User::count(),
            'admins_count' => User::where('role', 'admin')->count(),
        ]);
    }
}
