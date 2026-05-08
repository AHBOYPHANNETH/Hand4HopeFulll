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
                'price' => 0,
            ],
            [
                'title' => 'Rights & Family Advocacy Clinic',
                'description' => 'Legal volunteers meet families for guidance on education access and documentation.',
                'starts_at' => Carbon::now()->addWeeks(5)->setTime(13, 30),
                'location' => 'Partner NGO Hub, Phnom Penh',
                'price' => 0,
            ],
            [
                'title' => 'Volunteer Orientation',
                'description' => 'Learn safeguarding practices and classroom support strategies.',
                'starts_at' => Carbon::now()->addDays(10)->setTime(18, 0),
                'location' => 'Online (link emailed)',
                'price' => 0,
            ],
            [
                'title' => 'Speech Therapy Workshop',
                'description' => 'Hands-on session led by certified therapists for parents and aides.',
                'starts_at' => Carbon::now()->addWeeks(3)->setTime(10, 0),
                'location' => 'Hand4Hope Community Center, Phnom Penh',
                'price' => 0,
            ],
            [
                'title' => 'Family Picnic & Awareness Walk',
                'description' => 'Community walk and picnic to raise awareness about inclusion and disability rights.',
                'starts_at' => Carbon::now()->addWeeks(4)->setTime(7, 30),
                'location' => 'Wat Phnom Park, Phnom Penh',
                'price' => 0,
            ],
            [
                'title' => 'Music & Arts Therapy Showcase',
                'description' => 'Children present art and musical pieces created during weekly therapy sessions.',
                'starts_at' => Carbon::now()->addWeeks(6)->setTime(15, 0),
                'location' => 'Koh Pich Cultural Hall, Phnom Penh',
                'price' => 5,
            ],
            [
                'title' => 'Charity Run for Inclusion',
                'description' => '5K run raising funds for adapted learning materials and therapy programs.',
                'starts_at' => Carbon::now()->addWeeks(7)->setTime(6, 0),
                'location' => 'Olympic Stadium, Phnom Penh',
                'price' => 10,
            ],
            [
                'title' => 'Caregiver Skill Workshop',
                'description' => 'Practical strategies for supporting daily routines and learning at home.',
                'starts_at' => Carbon::now()->addWeeks(2)->setTime(14, 0),
                'location' => 'Hand4Hope Training Room, Phnom Penh',
                'price' => 0,
            ],
            [
                'title' => 'Annual Donor Appreciation Gala',
                'description' => 'Evening of stories, music and recognition for the donors who power our mission.',
                'starts_at' => Carbon::now()->addWeeks(8)->setTime(18, 30),
                'location' => 'Sofitel Phokeethra, Phnom Penh',
                'price' => 50,
            ],
            [
                'title' => 'Inclusive Sports Day',
                'description' => 'Adaptive sports tournament where children, families and volunteers play together.',
                'starts_at' => Carbon::now()->addWeeks(9)->setTime(8, 0),
                'location' => 'Phnom Penh Sports Complex',
                'price' => 0,
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
