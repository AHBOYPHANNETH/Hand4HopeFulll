<?php

namespace App\Services;

use App\Models\UserNotification;

class NotificationService
{
    public function createForUser(
        int $userId,
        string $title,
        string $message,
        string $type
    ): UserNotification {
        return UserNotification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'is_read' => false,
        ]);
    }
}
