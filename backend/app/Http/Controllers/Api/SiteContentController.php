<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;

class SiteContentController extends Controller
{
    public function index()
    {
        $map = SiteContent::query()->orderBy('key')->pluck('value', 'key');

        return response()->json($map);
    }
}
