<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminEventRosterController extends Controller
{
    /**
     * List events together with their approved-volunteer counts so the admin
     * can pick one to inspect / export.
     */
    public function index(): JsonResponse
    {
        $events = Event::query()
            ->orderByDesc('starts_at')
            ->get(['id', 'title', 'starts_at', 'location', 'capacity'])
            ->map(function (Event $event): array {
                $counts = DB::table('event_volunteers')
                    ->selectRaw("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved")
                    ->selectRaw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending")
                    ->where('event_id', $event->id)
                    ->first();

                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'starts_at' => $event->starts_at?->toIso8601String(),
                    'location' => $event->location,
                    'capacity' => $event->capacity,
                    'approved_count' => (int) ($counts->approved ?? 0),
                    'pending_count' => (int) ($counts->pending ?? 0),
                ];
            });

        return response()->json($events);
    }

    /** Approved volunteers for a single event (JSON, for the admin UI). */
    public function show(Event $event): JsonResponse
    {
        return response()->json([
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'starts_at' => $event->starts_at?->toIso8601String(),
                'location' => $event->location,
                'capacity' => $event->capacity,
            ],
            'volunteers' => $this->approvedRows($event),
        ]);
    }

    /**
     * CSV export — Excel opens it directly. Sanctum tokens go over the
     * Authorization header, so the frontend has to fetch this as a blob and
     * trigger the download client-side.
     */
    public function export(Event $event): StreamedResponse
    {
        $filename = $this->slug($event->title).'-volunteers.csv';

        return response()->streamDownload(function () use ($event): void {
            $out = fopen('php://output', 'w');
            // BOM so Excel detects UTF-8 (otherwise Khmer / accents break).
            fwrite($out, "\xEF\xBB\xBF");

            fputcsv($out, [
                '#',
                'Name',
                'Gender',
                'Phone',
                'Date of birth',
                'Email',
                'Notes',
                'Requested at',
            ]);

            foreach ($this->approvedRows($event) as $i => $row) {
                fputcsv($out, [
                    $i + 1,
                    $row['name'],
                    $row['gender'],
                    $row['phone'],
                    $row['date_of_birth'],
                    $row['email'],
                    $row['notes'],
                    $row['requested_at'],
                ]);
            }

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /** @return array<int, array<string, mixed>> */
    private function approvedRows(Event $event): array
    {
        return DB::table('event_volunteers')
            ->where('event_id', $event->id)
            ->where('status', 'approved')
            ->orderBy('event_volunteers.created_at')
            ->get([
                'name',
                'gender',
                'phone',
                'date_of_birth',
                'email',
                'notes',
                'created_at as requested_at',
            ])
            ->map(fn ($row) => (array) $row)
            ->all();
    }

    private function slug(string $value): string
    {
        $value = preg_replace('/[^A-Za-z0-9]+/', '-', $value);
        return strtolower(trim((string) $value, '-')) ?: 'event';
    }
}
