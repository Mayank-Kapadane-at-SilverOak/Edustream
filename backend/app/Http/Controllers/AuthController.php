<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = JWTAuth::fromUser($user);

            Log::info('User registered successfully', [
                'user_id' => $user->_id,
                'email' => $user->email
            ]);

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Registration successful'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'email' => $request->email
            ]);

            return response()->json([
                'error' => 'Registration failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = auth()->attempt($credentials)) {
                return response()->json([
                    'error' => 'Invalid credentials',
                    'message' => 'Email or password is incorrect'
                ], 401);
            }

            $user = auth()->user();

            Log::info('User logged in successfully', [
                'user_id' => $user->_id,
                'email' => $user->email
            ]);

            return response()->json([
                'token' => $token,
                'user' => $user,
                'message' => 'Login successful'
            ]);

        } catch (\Exception $e) {
            Log::error('Login failed', [
                'error' => $e->getMessage(),
                'email' => $request->email
            ]);

            return response()->json([
                'error' => 'Login failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function refresh()
    {
        try {
            $token = auth()->refresh();
            
            Log::info('Token refreshed successfully', [
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'token' => $token,
                'message' => 'Token refreshed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Token refresh failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Token refresh failed',
                'message' => $e->getMessage()
            ], 401);
        }
    }

    public function logout()
    {
        try {
            auth()->logout();
            
            Log::info('User logged out successfully', [
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'message' => 'Successfully logged out'
            ]);

        } catch (\Exception $e) {
            Log::error('Logout failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Logout failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function me()
    {
        try {
            $user = auth()->user();
            
            return response()->json([
                'user' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('User info retrieval failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'User info retrieval failed',
                'message' => $e->getMessage()
            ], 401);
        }
    }
}
