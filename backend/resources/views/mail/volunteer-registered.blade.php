<x-mail::message>
@if($isAdminCopy)
# Volunteer registered

**Event:** {{ $event->title }}  
**Volunteer:** {{ $user->name }} ({{ $user->email }})  
**Date:** {{ $event->starts_at->format('M j, Y g:i A') }}
@else
# You are signed up!

Hi {{ $user->name }},

Thank you for volunteering for **{{ $event->title }}** on {{ $event->starts_at->format('M j, Y') }}.

We will share more details closer to the date.

— Hand4Hope
@endif

</x-mail::message>
