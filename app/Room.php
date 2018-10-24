<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    //
    protected $fillable = ['name', 'private', 'user_id' ];
    protected $hidden = ['id'];

    /**
     * Get filtered rooms for guest/user
     *
     * @param Builder $query
     * @param integer $user_id user id to include private rooms or null for guests (default)
     * @return Builder
     */
    public static function scopeAllFiltered($query, $user_id = null)
    {
        // Get all rooms excluding private ones (if guest) or including private rooms owned by current user
        if($user_id != null)
            return $query->where('private', false)->orWhere('user_id', $user_id);
        return $query->where('private', false);
    }

    /**
     * Get the user who owns this room
     *
     * @return App\User
     */
    public function owner()
    {
        return $this->belongsTo('App\User', 'user_id');
    }

    /**
     * Get messages in this room
     *
     * @return App\Message[]
     */
    public function messages()
    {
        return $this->hasMany('App\Message');
    }

    /**
     * Get users subscribed to this room
     *
     * @return App\User[]
     */
    public function users()
    {
        return $this->belongsToMany('App\User', 'room_users')->withTimestamps(); // many-to-many
    }
}
