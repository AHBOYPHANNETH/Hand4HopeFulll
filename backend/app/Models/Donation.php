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
        'deeplink',
        'bakong_hash',
        'paid_at',
        'expires_at',
    ];

    protected $hidden = [
        'qr_string',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isExpired(): bool
    {
        return $this->status === 'pending'
            && $this->expires_at !== null
            && $this->expires_at->isPast();
    }
}
