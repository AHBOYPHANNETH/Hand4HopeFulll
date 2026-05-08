<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\VolunteerRegistered;
use App\Models\Event;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EventVolunteerController extends Controller
{
    public function store(Request $request, Event $event, NotificationService $notificationService)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:40'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = $request->user();

        if ($event->starts_at->isPast()) {
            return response()->json(['message' => 'This event has already ended.'], 422);
        }

        if ($event->volunteers()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You are already registered for this event.'], 422);
        }

        if ($event->is_full) {
            return response()->json([
                'message' => 'This event has reached its volunteer capacity.',
            ], 422);
        }

        $event->volunteers()->attach($user->id, [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'date_of_birth' => $data['date_of_birth'],
            'notes' => $data['notes'] ?? null,
            'status' => 'pending',
        ]);

        $notificationService->createForUser(
            $user->id,
            'Volunteer request received',
            "Your volunteer request for {$event->title} has been received and is pending review.",
            'volunteer_request_received'
        );

        Mail::to($user->email)->send(new VolunteerRegistered($event, $user));

        $admin = config('mail.admin_address');
        if ($admin) {
            Mail::to($admin)->send(new VolunteerRegistered($event, $user, isAdminCopy: true));
        }

        return response()->json(['message' => 'Thank you for volunteering! Check your email for details.']);
    }
}
