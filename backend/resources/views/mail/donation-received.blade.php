<x-mail::message>
@if($isAdminCopy)
# New donation

**Name:** {{ $donation->name }}  
**Email:** {{ $donation->email }}  
**Amount:** {{ $donation->currency }} {{ number_format((float) $donation->amount, 2) }}

@if($donation->message)
**Message:**  
{{ $donation->message }}
@endif
@else
# Thank you, {{ $donation->name }}!

Your generous gift of **{{ $donation->currency }} {{ number_format((float) $donation->amount, 2) }}** helps children with intellectual disabilities in Cambodia access daycare, education, and protection.

Hands of Hope Community — Hand4Hope
@endif

</x-mail::message>
