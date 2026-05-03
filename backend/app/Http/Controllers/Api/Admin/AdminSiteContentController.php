<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;

class AdminSiteContentController extends Controller
{
    public function index()
    {
        return response()->json(SiteContent::orderBy('key')->get());
    }

    public function upsert(Request $request)
    {
        $data = $request->validate([
            'contents' => ['required', 'array', 'min:1'],
            'contents.*.key' => ['required', 'string', 'max:255'],
            'contents.*.value' => ['nullable', 'string'],
        ]);

        foreach ($data['contents'] as $row) {
            SiteContent::updateOrCreate(
                ['key' => $row['key']],
                ['value' => $row['value'] ?? '']
            );
        }

        return response()->json(SiteContent::orderBy('key')->get());
    }
}
