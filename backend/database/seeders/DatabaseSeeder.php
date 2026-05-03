<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\SiteContent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@hand4hope.test')],
            [
                'name' => 'Hand4Hope Admin',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'role' => 'admin',
                'provider' => null,
                'provider_id' => null,
            ]
        );

        $defaults = [
            'hero_title' => 'Hands of Hope for Every Child',
            'hero_subtitle' => 'Daycare, inclusive education, and rights protection for children with intellectual disabilities in Cambodia.',
            'mission_text' => 'Hand4Hope exists so families receive respite, children learn in dignity, and communities understand inclusion.',
            'vision_text' => 'A Cambodia where children with intellectual disabilities are visible, valued, and supported.',
            'about_story' => 'Founded by caregivers and educators, Hand4Hope grows community-led programs grounded in compassion and evidence.',
            'impact_stat_children' => '120',
            'impact_stat_volunteers' => '85',
            'impact_stat_sessions' => '2400',
            'contact_address' => 'Phnom Penh, Cambodia',
            'contact_hours' => 'Mon–Sat · 8:00–17:00',
            'testimonials_json' => json_encode([
                [
                    'quote' => 'My daughter smiles every morning knowing she has friends who understand her.',
                    'name' => 'Sophea',
                    'role' => 'Parent partner',
                ],
                [
                    'quote' => 'Volunteering here changed how I see ability in our community.',
                    'name' => 'Dara',
                    'role' => 'Student volunteer',
                ],
            ]),
        ];

        foreach ($defaults as $key => $value) {
            SiteContent::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $events = [
            [
                'title' => 'Inclusive Play Day',
                'description' => 'Volunteers host sensory-friendly games and creative workshops for children and siblings.',
                'starts_at' => Carbon::now()->addWeeks(2)->setTime(9, 0),
                'location' => 'Hand4Hope Community Center, Phnom Penh',
            ],
            [
                'title' => 'Rights & Family Advocacy Clinic',
                'description' => 'Legal volunteers meet families for guidance on education access and documentation.',
                'starts_at' => Carbon::now()->addWeeks(5)->setTime(13, 30),
                'location' => 'Partner NGO Hub, Phnom Penh',
            ],
            [
                'title' => 'Volunteer Orientation',
                'description' => 'Learn safeguarding practices and classroom support strategies.',
                'starts_at' => Carbon::now()->addDays(10)->setTime(18, 0),
                'location' => 'Online (link emailed)',
            ],
        ];

        foreach ($events as $payload) {
            Event::firstOrCreate(
                ['title' => $payload['title']],
                $payload
            );
        }
    }
}
