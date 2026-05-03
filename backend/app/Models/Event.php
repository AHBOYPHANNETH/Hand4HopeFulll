<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    protected $appends = ['image_url'];

    protected $fillable = [
        'title',
        'description',
        'starts_at',
        'location',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
        ];
    }

    public function volunteers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_volunteers')
            ->withPivot('notes')
            ->withTimestamps();
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }

        return asset('storage/'.ltrim($this->image_path, '/'));
    }
}
