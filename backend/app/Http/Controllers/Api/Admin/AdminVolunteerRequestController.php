<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AdminVolunteerRequestController extends Controller
{
    public function index()
    {
        $rows = DB::table('event_volunteers')
            ->join('users', 'users.id', '=', 'event_volunteers.user_id')
            ->join('events', 'events.id', '=', 'event_volunteers.event_id')
            ->select([
                'event_volunteers.event_id',
                'event_volunteers.user_id',
                'event_volunteers.status',
                'event_volunteers.notes',
                'event_volunteers.name as volunteer_name',
                'event_volunteers.email as volunteer_email',
                'event_volunteers.phone as volunteer_phone',
                'event_volunteers.date_of_birth as volunteer_dob',
                'event_volunteers.created_at as requested_at',
                'users.name as user_name',
                'users.email as user_email',
                'events.title as event_title',
                'events.starts_at as event_starts_at',
            ])
            ->orderByDesc('event_volunteers.created_at')
            ->get();

        return response()->json($rows);
    }

    public function updateStatus(Request $request, NotificationService $notificationService)
    {
        $data = $request->validate([
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'status' => ['required', 'in:approved,rejected'],
        ]);

        $updated = DB::table('event_volunteers')
            ->where('event_id', $data['event_id'])
            ->where('user_id', $data['user_id'])
            ->update([
                'status' => $data['status'],
                'updated_at' => now(),
            ]);

        if (! $updated) {
            return response()->json(['message' => 'Volunteer request not found.'], 404);
        }

        $user = User::findOrFail($data['user_id']);
        $event = Event::findOrFail($data['event_id']);
        $isApproved = $data['status'] === 'approved';
        $title = $isApproved ? 'Volunteer request accepted' : 'Volunteer request rejected';
        $message = $isApproved
            ? "Your volunteer request for {$event->title} has been accepted."
            : "Your volunteer request for {$event->title} was not approved this time.";

        $notificationService->createForUser(
            $user->id,
            $title,
            $message,
            $isApproved ? 'volunteer_request_accepted' : 'volunteer_request_rejected'
        );
        if ($user->email_notifications) {
            Mail::raw($message, static function ($mail) use ($user, $title): void {
                $mail->to($user->email)->subject($title);
            });
        }

        return response()->json([
            'message' => $isApproved
                ? 'Volunteer request approved and user notified.'
                : 'Volunteer request rejected and user notified.',
        ]);
    }
}
