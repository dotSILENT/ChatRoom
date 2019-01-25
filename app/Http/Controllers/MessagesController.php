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
use App\Events\NewRoomMessage;

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

        $messages = $messages->orderBy('id', 'desc')
            ->limit('50')
            ->with('user')
            ->get();

        return MessageResource::collection($messages)->additional(['meta' => [
                'first_id' => $messages->min('id'),
                'last_id' => $messages->max('id')
            ]
        ]);
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
            'message' => 'required|string|max:65535'
        ]);
        
        // TODO: Handle file uploads
        $room = Room::findOrFail($room);
        
        $msg = new Message;
        $msg->room_id = $room->id;
        $msg->user_id = Auth::guard('api')->id();
        $msg->content = $vdata['message'];
        $msg->type = 'message';
        $msg->save();

        // Broadcast event
        event(new NewRoomMessage($msg));
        return response()->json(['status' => 'success'], 200);
    }

    /**
     * Delete user's own message
     * TODO: Add permissions to delete messages of other users
     * 
     * @param integer $room Room ID
     * @param integer $message Message ID
     * @return response
     * 
     */
    public function destroy($room, $message)
    {
        $room = Room::findOrFail($room);

        $message = $room->messages()->where('id', $message)->first();

        if($message->user->id !== Auth::guard('api')->id())
        {
            return response()->json(['status' => 'fail'], 403);
        }
        else
        {
            $message->delete();
        }

        // TODO Add event
        return response()->json(['status' => 'success'], 200);
    }
}
