<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\OrderController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public course viewing
Route::get('/courses', [CourseController::class, 'index']);

// Test route to verify API is working
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!', 'timestamp' => now()]);
});

// Test database connection
Route::get('/test-db', function () {
    try {
        $user = new \App\Models\User();
        $user->getConnection()->getMongoDB()->listCollections();
        return response()->json(['message' => 'Database connection successful!']);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
    }
});

// Test authentication without JWT
Route::get('/test-auth', function () {
    try {
        // Test basic user creation and retrieval
        $user = \App\Models\User::first();
        if ($user) {
            return response()->json([
                'message' => 'User model working',
                'user_id' => $user->_id,
                'email' => $user->email
            ]);
        } else {
            return response()->json(['message' => 'No users found in database']);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Authentication test failed: ' . $e->getMessage()], 500);
    }
});

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth routes (require valid token)
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Course and order routes
    Route::post('/courses', [CourseController::class, 'store']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::get('/dashboard', [OrderController::class, 'dashboard']);
});

Route::get('/test-api', function () {
    return response()->json(['message' => 'API routes are working ✅']);
});