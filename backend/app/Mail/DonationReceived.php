<?php

namespace App\Mail;

use App\Models\Donation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DonationReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Donation $donation,
        public bool $isAdminCopy = false,
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->isAdminCopy
            ? 'New donation received — Hand4Hope'
            : 'Thank you for supporting Hand4Hope';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.donation-received',
        );
    }
}
