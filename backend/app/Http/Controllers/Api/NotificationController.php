<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->limit(50)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => (int) $request->user()->notifications()->where('is_read', false)->count(),
        ]);
    }

    public function markRead(Request $request)
    {
        $data = $request->validate([
            'id' => ['nullable', 'integer'],
        ]);

        $query = $request->user()->notifications()->where('is_read', false);
        if (! empty($data['id'])) {
            $query->where('id', $data['id']);
        }
        $query->update(['is_read' => true]);

        return response()->json(['message' => 'Notifications marked as read.']);
    }

    public function create(Request $request, NotificationService $notificationService)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
            'type' => ['required', 'string', 'max:80'],
        ]);

        $notification = $notificationService->createForUser(
            (int) $data['user_id'],
            $data['title'],
            $data['message'],
            $data['type']
        );

        return response()->json($notification, 201);
    }
}
