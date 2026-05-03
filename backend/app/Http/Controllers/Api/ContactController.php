<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactSubmitted;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $contact = Contact::create($data);

        $admin = config('mail.admin_address');
        if ($admin) {
            Mail::to($admin)->send(new ContactSubmitted($contact));
        }

        return response()->json([
            'message' => 'Your message has been received. We will get back to you soon.',
        ], 201);
    }
}
