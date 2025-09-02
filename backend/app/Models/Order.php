<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;  // ✅ new package

class Order extends Model
{
    protected $collection = 'orders';

    protected $fillable = [
        'user_id', 'courses', 'status', 'amount'
    ];

    // Ensure _id is included in JSON responses
    protected $hidden = [];
    
    // Cast fields to proper types
    protected $casts = [
        'amount' => 'float',
        'courses' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Validation rules
    public static $rules = [
        'user_id' => 'required|string',
        'courses' => 'required|array|min:1',
        'courses.*.course_id' => 'required|string',
        'courses.*.title' => 'required|string',
        'courses.*.price' => 'required|numeric|min:0',
        'amount' => 'required|numeric|min:0',
        'status' => 'string|in:pending,processing,completed,cancelled'
    ];

    // Available order statuses
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Get available statuses
    public static function getAvailableStatuses()
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_PROCESSING,
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED
        ];
    }

    // Override toArray to ensure _id is properly included
    public function toArray()
    {
        $array = parent::toArray();
        // Ensure _id is present and properly formatted
        if (isset($array['_id'])) {
            $array['_id'] = (string) $array['_id'];
        }
        return $array;
    }

    // Get total number of courses in this order
    public function getCourseCountAttribute()
    {
        return count($this->courses ?? []);
    }

    // Check if order is completed
    public function isCompleted()
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    // Check if order is pending
    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }
}
