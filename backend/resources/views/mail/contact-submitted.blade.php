<x-mail::message>
# Contact message

**From:** {{ $contact->name }} ({{ $contact->email }})  
@if($contact->phone)
**Phone:** {{ $contact->phone }}
@endif

**Message:**  
{{ $contact->message }}

</x-mail::message>
