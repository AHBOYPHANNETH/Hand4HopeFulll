<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'name',
        'email',
        'amount',
        'currency',
        'message',
        'status',
        'md5',
        'qr_string',
        'bakong_hash',
        'paid_at',
    ];

    protected $hidden = [
        'qr_string',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
