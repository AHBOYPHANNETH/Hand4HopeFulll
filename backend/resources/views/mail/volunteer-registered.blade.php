<x-mail::message>
@if($isAdminCopy)
# Volunteer registered

**Event:** {{ $event->title }}  
**Volunteer:** {{ $user->name }} ({{ $user->email }})  
**Date:** {{ $event->starts_at->format('M j, Y g:i A') }}
@else
# You're on the list

Hi {{ $user->name }},

We've got you down for **{{ $event->title }}** on {{ $event->starts_at->format('M j, Y') }}.

A couple of days before, we'll send the meeting spot and what to wear. If something comes up and you can't make it, just reply to this email.

See you there.

— Hand4Hope
@endif

</x-mail::message>
