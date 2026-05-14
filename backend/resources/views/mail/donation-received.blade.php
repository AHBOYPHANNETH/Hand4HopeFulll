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
# Thanks {{ $donation->name }} 🙏

We got your **{{ $donation->currency }} {{ number_format((float) $donation->amount, 2) }}**. It's going straight into the bag of supplies for the next event. We'll post photos when we run it.

If you want a tax receipt, just reply to this email with your reference number and we'll send one over.

— The Hand4Hope crew
@endif

</x-mail::message>
