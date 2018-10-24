<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /**
     * Mass assignable attributes
     *
     * @var array
     */
    protected $fillable = ['room_id', 'user_id', 'content'];

    /**
     * Attributes hidden for arrays
     *
     * @var array
     */
    protected $hidden = ['room_id', 'user_id'];

    /**
     * The room that this message belongs to
     * 
     * @return App\Room
     */
    public function room()
    {
        return $this->belongsTo('App\Room');
    }

    /**
     * The user that created this message
     *
     * @return App\User
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
