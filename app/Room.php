<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    //
    protected $fillable = ['name', 'private', 'user_id' ];
    protected $hidden = ['id'];


    public static function scopeAllFiltered($query, $user_id = null)
    {
        // Get all rooms excluding private ones (if guest) or including private rooms owned by current user
        if($user_id != null)
            return $query->where('private', false)->orWhere('user_id', $user_id);
        return $query->where('private', false);
    }

    public function owner()
    {
        return $this->belongsTo('App\User', 'user_id');
    }

    public function messages()
    {
        return $this->hasMany('App\Message');
    }
}
