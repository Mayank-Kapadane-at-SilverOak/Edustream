<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing user and courses
        $user = User::first();
        $courses = Course::all();

        if (!$user || $courses->isEmpty()) {
            $this->command->error('Please run UserSeeder and CourseSeeder first!');
            return;
        }

        // Create sample orders with different structures
        $sampleOrders = [
            [
                'user_id' => $user->_id,
                'courses' => [
                    [
                        'course_id' => $courses[0]->_id,
                        'title' => $courses[0]->title,
                        'price' => $courses[0]->price,
                        'category' => $courses[0]->category
                    ]
                ],
                'status' => 'completed',
                'amount' => $courses[0]->price,
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(5)
            ],
            [
                'user_id' => $user->_id,
                'courses' => [
                    [
                        'course_id' => $courses[1]->_id,
                        'title' => $courses[1]->title,
                        'price' => $courses[1]->price,
                        'category' => $courses[1]->category
                    ],
                    [
                        'course_id' => $courses[2]->_id,
                        'title' => $courses[2]->title,
                        'price' => $courses[2]->price,
                        'category' => $courses[2]->category
                    ]
                ],
                'status' => 'pending',
                'amount' => $courses[1]->price + $courses[2]->price,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2)
            ],
            [
                'user_id' => $user->_id,
                'courses' => [
                    [
                        'course_id' => $courses[0]->_id,
                        'title' => $courses[0]->title,
                        'price' => $courses[0]->price,
                        'category' => $courses[0]->category
                    ],
                    [
                        'course_id' => $courses[1]->_id,
                        'title' => $courses[1]->title,
                        'price' => $courses[1]->price,
                        'category' => $courses[1]->category
                    ],
                    [
                        'course_id' => $courses[2]->_id,
                        'title' => $courses[2]->title,
                        'price' => $courses[2]->price,
                        'category' => $courses[2]->category
                    ]
                ],
                'status' => 'processing',
                'amount' => $courses->sum('price'),
                'created_at' => now()->subDay(),
                'updated_at' => now()
            ]
        ];

        foreach ($sampleOrders as $orderData) {
            Order::create($orderData);
        }

        $this->command->info('Sample orders created successfully!');
    }
}
