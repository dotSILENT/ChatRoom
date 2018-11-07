<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Traits\APIToken;

class User extends Authenticatable
{
    use Notifiable, APIToken;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'nickname', 'email', 'password'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'api_token', 'password', 'remember_token', 'email', 'email_verified_at'
    ];

    /**
     * Return the display name (username or nickname if set)
     *
     * @return string
     */
    public function displayName()
    {
        if(strlen($this->nickname) <= 0)
            return $this->username;
        return $this->nickname;
    }

    /**
     * Get chat rooms created by this user
     */
    public function ownedRooms()
    {
        return $this->hasMany(Room::class);
    }

    /**
     * Get rooms this user is inside of
     */
    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_users'); // many-to-many
    }
}
