<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query()->orderBy('starts_at');

        if ($request->boolean('upcoming')) {
            $query->where('starts_at', '>=', now());
        }

        return response()->json($query->get());
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }
}
