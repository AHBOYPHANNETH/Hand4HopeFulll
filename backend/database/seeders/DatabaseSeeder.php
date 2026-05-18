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
            'hero_title' => 'Volunteer a day. Help your neighbourhood.',
            'hero_subtitle' => 'Hand4Hope runs small, weekend-friendly volunteer events around Phnom Penh. Bring yourself, bring a friend, leave a place a bit better than you found it.',
            'mission_text' => 'We pick one street, one park, one community at a time, and we do something useful there. The work is small. We just do a lot of it.',
            'vision_text' => 'We want every part of Phnom Penh to have a few people who say "yeah, that\'s my neighbourhood" and mean it.',
            'about_story' => 'Hand4Hope started in 2023 when four of us got tired of complaining about the rubbish on our own street and went out one Sunday to clean it. We posted about it, a few neighbours came the next week, and it kept growing. We\'re still run entirely by volunteers. There\'s no head office, just a Telegram group and a volunteer calendar.',
            'impact_stat_children' => '120',
            'impact_stat_volunteers' => '85',
            'impact_stat_sessions' => '2400',
            'contact_address' => 'Phnom Penh, Cambodia',
            'contact_hours' => 'Mon–Sat · 8:00–17:00',
            'testimonials_json' => json_encode([
                [
                    'quote' => 'I went to one clean-up in Tuol Kork and ended up coming back every weekend. The people are normal. The work isn\'t complicated. You just turn up.',
                    'name' => 'Sophea Chan',
                    'role' => 'Volunteer since 2024',
                ],
                [
                    'quote' => 'I was nervous on my first event because I didn\'t know anyone. By the end of the morning I had three new phone numbers and an aching back. Worth it.',
                    'name' => 'Dara Pich',
                    'role' => 'Student, RUPP',
                ],
                [
                    'quote' => 'I don\'t have time most weekends but I send what I can each month. They post photos and receipts in the group, so I can see where it went.',
                    'name' => 'Channary Sok',
                    'role' => 'Donor',
                ],
            ]),
        ];

        foreach ($defaults as $key => $value) {
            SiteContent::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $events = [
            [
                'title' => 'Neighbourhood Clean-Up Day',
                'description' => 'Volunteers spend the morning tidying up streets, parks and waterways together. Gloves, bags and water provided.',
                'starts_at' => Carbon::now()->addDays(4)->setTime(9, 0),
                'location' => 'Hand4Hope Community Center, Phnom Penh',
                'price' => 0,
                'capacity' => 30,
            ],
            [
                'title' => 'Volunteer Orientation',
                'description' => 'Brand-new volunteers learn how our events run, our safeguarding rules and how to choose their first role.',
                'starts_at' => Carbon::now()->addDays(10)->setTime(18, 0),
                'location' => 'Online (link emailed)',
                'price' => 0,
                'capacity' => 25,
            ],
            [
                'title' => 'Community Help Desk',
                'description' => 'Free guidance from volunteer lawyers and case workers on documents, school enrolment and family paperwork.',
                'starts_at' => Carbon::now()->addWeeks(2)->setTime(13, 30),
                'location' => 'Partner NGO Hub, Phnom Penh',
                'price' => 0,
                'capacity' => 15,
            ],
            [
                'title' => 'Wellbeing & First-Aid Workshop',
                'description' => 'Hands-on session led by certified medics — basic first aid, mental wellbeing and how to look after each other on event days.',
                'starts_at' => Carbon::now()->addWeeks(3)->setTime(10, 0),
                'location' => 'Hand4Hope Community Center, Phnom Penh',
                'price' => 0,
                'capacity' => 20,
            ],
            [
                'title' => 'Family Picnic & Community Walk',
                'description' => 'Open picnic and a friendly walk to bring neighbours together — bring something to share and somebody you want to meet.',
                'starts_at' => Carbon::now()->addWeeks(4)->setTime(7, 30),
                'location' => 'Wat Phnom Park, Phnom Penh',
                'price' => 0,
                'capacity' => 60,
            ],
            [
                'title' => 'Skills-Sharing Workshop',
                'description' => 'Volunteers teach volunteers — practical sessions on cooking, basic repairs, photography, simple coding and more.',
                'starts_at' => Carbon::now()->addWeeks(5)->setTime(14, 0),
                'location' => 'Hand4Hope Training Room, Phnom Penh',
                'price' => 0,
                'capacity' => 18,
            ],
            [
                'title' => 'Community Arts Showcase',
                'description' => 'Local artists and youth groups share music, paintings and stories from a season of community workshops.',
                'starts_at' => Carbon::now()->addWeeks(6)->setTime(15, 0),
                'location' => 'Koh Pich Cultural Hall, Phnom Penh',
                'price' => 5,
                'capacity' => 120,
            ],
            [
                'title' => 'Charity Run for the Community',
                'description' => '5K run raising funds for the next year of community events, training and emergency drives.',
                'starts_at' => Carbon::now()->addWeeks(7)->setTime(6, 0),
                'location' => 'Olympic Stadium, Phnom Penh',
                'price' => 10,
                'capacity' => 200,
            ],
            [
                'title' => 'Annual Volunteers & Donors Gala',
                'description' => 'A grateful evening of food, music and recognition for everyone whose hours and gifts powered the year.',
                'starts_at' => Carbon::now()->addWeeks(8)->setTime(18, 30),
                'location' => 'Sofitel Phokeethra, Phnom Penh',
                'price' => 50,
                'capacity' => 150,
            ],
            [
                'title' => 'Community Sports Day',
                'description' => 'Open-to-all tournament where kids, parents and volunteers play side by side. No experience needed, just bring trainers.',
                'starts_at' => Carbon::now()->addWeeks(9)->setTime(8, 0),
                'location' => 'Phnom Penh Sports Complex',
                'price' => 0,
                'capacity' => 80,
            ],
        ];

        $titles = array_column($events, 'title');

        // Drop any leftover events from previous seed sets (e.g. disability-focused demo data).
        Event::whereNotIn('title', $titles)->delete();

        foreach ($events as $payload) {
            Event::updateOrCreate(
                ['title' => $payload['title']],
                $payload
            );
        }
    }
}
