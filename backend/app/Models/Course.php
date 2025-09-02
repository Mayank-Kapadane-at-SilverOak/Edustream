<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;  // ✅ new package

class Course extends Model
{
    protected $collection = 'courses';

    protected $fillable = [
        'title', 'description', 'media_url', 'price', 'category'
    ];

    // Ensure _id is included in JSON responses
    protected $hidden = [];
    
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
}
