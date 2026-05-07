<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserVolunteerRequestController extends Controller
{
    public function index(Request $request)
    {
        $items = $request->user()
            ->volunteeredEvents()
            ->orderByDesc('starts_at')
            ->get()
            ->map(function ($event) {
                return [
                    'event_id' => $event->id,
                    'event_title' => $event->title,
                    'event_starts_at' => $event->starts_at,
                    'event_location' => $event->location,
                    'status' => $event->pivot->status,
                    'notes' => $event->pivot->notes,
                    'requested_at' => $event->pivot->created_at,
                ];
            });

        return response()->json($items);
    }
}
