<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validate the request using model rules
            $validated = $request->validate(Order::$rules);

            // Create the order
            $order = Order::create([
                'user_id' => Auth::id(),
                'courses' => $validated['courses'],
                'status' => $validated['status'] ?? Order::STATUS_PENDING,
                'amount' => $validated['amount'],
            ]);

            Log::info('Order created successfully', [
                'order_id' => $order->_id,
                'user_id' => Auth::id(),
                'amount' => $order->amount,
                'course_count' => $order->course_count
            ]);

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Order validation failed', [
                'errors' => $e->errors(),
                'user_id' => Auth::id()
            ]);
            
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id()
            ]);
            
            return response()->json([
                'message' => 'Failed to create order',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    public function dashboard()
    {
        try {
            $orders = Order::where('user_id', Auth::id())
                         ->orderBy('created_at', 'desc')
                         ->get();

            $totalSpent = $orders->sum('amount');
            $completedCourses = $orders->where('status', Order::STATUS_COMPLETED)->count();
            $pendingOrders = $orders->where('status', Order::STATUS_PENDING)->count();

            Log::info('Dashboard loaded successfully', [
                'user_id' => Auth::id(),
                'order_count' => $orders->count(),
                'total_spent' => $totalSpent
            ]);

            return response()->json([
                'orders' => $orders,
                'totalSpent' => $totalSpent,
                'completedCourses' => $completedCourses,
                'pendingOrders' => $pendingOrders,
                'totalOrders' => $orders->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id()
            ]);
            
            return response()->json([
                'message' => 'Failed to load dashboard',
                'error' => 'Internal server error'
            ], 500);
        }
    }

    // Get a specific order
    public function show($id)
    {
        try {
            $order = Order::where('user_id', Auth::id())
                         ->where('_id', $id)
                         ->first();

            if (!$order) {
                return response()->json([
                    'message' => 'Order not found'
                ], 404);
            }

            return response()->json([
                'order' => $order
            ]);

        } catch (\Exception $e) {
            Log::error('Order retrieval failed', [
                'error' => $e->getMessage(),
                'order_id' => $id,
                'user_id' => Auth::id()
            ]);
            
            return response()->json([
                'message' => 'Failed to retrieve order',
                'error' => 'Internal server error'
            ], 500);
        }
    }
}
