<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;
use App\Room;
use App\User;
use Illuminate\Support\Facades\Auth;

class MessagesController extends Controller
{

    public function __construct()
    {
        //$this->middleware('auth:api');
    }
    /**
     * Return last 50 messages in specified room
     *
     * @param integer $room Room ID
     * @return void
     */
    public function index($room)
    {
        $room = Room::findOrFail($room); // TODO: Change this to use short-uuid instead of room ids
        $messages = $room->messages()
            ->orderBy('created_at', 'desc')
            ->limit('50')
            ->with('user')
            ->get()
            ->reverse();
        return $messages->toJson();
    }
}
