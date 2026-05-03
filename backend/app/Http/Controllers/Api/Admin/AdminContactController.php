<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;

class AdminContactController extends Controller
{
    public function index()
    {
        return response()->json(Contact::orderByDesc('created_at')->limit(100)->get());
    }
}
