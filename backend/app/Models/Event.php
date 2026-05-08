<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    protected $appends = ['image_url', 'volunteers_count', 'is_full'];

    protected $fillable = [
        'title',
        'description',
        'starts_at',
        'location',
        'image_path',
        'price',
        'capacity',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'capacity' => 'integer',
        ];
    }

    public function getVolunteersCountAttribute(): int
    {
        // Count active volunteer slots — pending and approved take up a seat.
        if (array_key_exists('volunteers_count_attr', $this->attributes)) {
            return (int) $this->attributes['volunteers_count_attr'];
        }

        return (int) $this->volunteers()
            ->wherePivotIn('status', ['pending', 'approved'])
            ->count();
    }

    public function getIsFullAttribute(): bool
    {
        if (! $this->capacity) {
            return false;
        }

        return $this->volunteers_count >= $this->capacity;
    }

    public function volunteers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_volunteers')
            ->withPivot('name', 'email', 'phone', 'date_of_birth', 'notes', 'status')
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
