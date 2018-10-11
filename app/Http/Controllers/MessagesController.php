<?php

/**
 *  Messages JSON API Controller 
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Message;
use App\Room;
use App\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\MessageResource;

class MessagesController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }
    /**
     * Return last 50 messages in specified room
     *
     * @param integer $room Room ID
     * @return void
     */
    public function index(Request $request, $room)
    {
        $room = Room::findOrFail($room); // TODO: Change this to use short-uuid instead of room ids
        
        $messages = $room->messages();

        if($request->has('after'))
        {
            $messages = $messages->where('id', '>', $request->after);
        }
        else if($request->has('before'))
        {
            $messages = $messages->where('id', '<', $request->before);
        }
        else
        {
            $messages = $room->messages();
        }

        $messages = $messages->orderBy('created_at', 'desc')
            ->limit('50')
            ->with('user')
            ->get();

        return MessageResource::collection($messages);
    }

    /**
     * Store a new message
     *
     * @param Illuminate\Http\Request $request Request data sent by user
     * @param integer $room Room ID
     * @return void
     */
    public function store(Request $request, $room)
    {
        $vdata = $request->validate([
            'message' => 'required|max:200'
        ]);
        
        // TODO: Handle file uploads
        $room = Room::findOrFail($room);
        
        $msg = new Message;
        $msg->room_id = $room->id;
        $msg->user_id = Auth::guard('api')->id();
        $msg->content = $vdata['message'];
        $msg->type = 'message';
        $msg->save();
        return response()->json(['status' => 'success'], 200);
    }
}
