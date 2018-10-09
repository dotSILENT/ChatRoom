<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $filalble = ['room_id', 'user_id', 'content', 'type'];
    protected $hidden = ['id'];

    
    public function room()
    {
        return $this->belongsTo('App\Room');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
