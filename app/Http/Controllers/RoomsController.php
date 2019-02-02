<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Room;
use Illuminate\Support\Facades\Auth;

class RoomsController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }


    /**
     * Display a listing of the chat rooms
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rooms = Room::allFiltered(Auth::check() ? Auth::user()->id : null)
            ->orderBy('private', 'desc')
            ->get();
            
        return view('index', compact('rooms'));
    }

    /**
     * Show the form for creating a new chat room
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('rooms.create');
    }

    /**
     * Store a newly created chat room in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $vdata = $request->validate([
            'roomName' => 'required|min:3|max:100',
            'private' => 'nullable'
        ]);
        
        $room = new Room;
        $room->name = $vdata['roomName'];
        $room->private = $request->has('private');
        $room->user_id = Auth::user()->id;
        $room->save();
        return redirect()->route('rooms.show', $room->id);
    }

    /**
     * Display the specified chat room.
     *
     * @param  int  $id Room ID
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $room = Room::findOrFail($id);

        if(!$room->users()->where('id', Auth::user()->id)->exists())
        {
            // User isn't subscribed to this room
            if($room->private && Auth::user()->id !== $room->owner->id)
            {
                // holla holla m8 this is a private one, you can only get added through an invite
                return redirect()->route('home')->setStatusCode(401);
            }
            else // public room or it's the owner of the private room
            {
                // Add him to the room
                $room->users()->attach(Auth::user()->id);
            }
        }
        return view('rooms.show', compact('room'));
    }

    /**
     * Show the form for editing the specified chat room.
     *
     * @param  int  $id Room ID
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified chat room in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id Room ID
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified chat room from storage.
     *
     * @param  int  $id Room ID
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $room = Room::findOrFail($id);

        if(Auth::user()->id !== $room->owner->id)
        {
            return redirect()->route('home')->setStatusCode(403); // forbidden
        }

        $room->delete();

        return redirect()->route('home')->setStatusCode(200);
    }
}
