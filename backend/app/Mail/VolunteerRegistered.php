<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VolunteerRegistered extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Event $event,
        public User $user,
        public bool $isAdminCopy = false,
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->isAdminCopy
            ? 'New volunteer signup — '.$this->event->title
            : 'You joined an event — Hand4Hope';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.volunteer-registered',
        );
    }
}
