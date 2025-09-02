<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Order;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test user directly
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        // Create sample courses
        $course1 = Course::create([
            'title' => 'Introduction to Web Development',
            'description' => 'Learn the basics of HTML, CSS, and JavaScript',
            'media_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'price' => 29.99,
            'category' => 'Web Development'
        ]);

        $course2 = Course::create([
            'title' => 'Advanced React.js',
            'description' => 'Master React hooks, context, and advanced patterns',
            'media_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            'price' => 49.99,
            'category' => 'Frontend Development'
        ]);

        $course3 = Course::create([
            'title' => 'Laravel Backend Development',
            'description' => 'Build robust APIs with Laravel and MongoDB',
            'media_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            'price' => 39.99,
            'category' => 'Backend Development'
        ]);

        // Create sample orders to ensure the collection structure is correct
        Order::create([
            'user_id' => $user->_id,
            'courses' => [
                [
                    'course_id' => $course1->_id,
                    'title' => $course1->title,
                    'price' => $course1->price
                ]
            ],
            'status' => 'completed',
            'amount' => $course1->price
        ]);

        Order::create([
            'user_id' => $user->_id,
            'courses' => [
                [
                    'course_id' => $course2->_id,
                    'title' => $course2->title,
                    'price' => $course2->price
                ],
                [
                    'course_id' => $course3->_id,
                    'title' => $course3->title,
                    'price' => $course3->price
                ]
            ],
            'status' => 'pending',
            'amount' => $course2->price + $course3->price
        ]);
    }
}
