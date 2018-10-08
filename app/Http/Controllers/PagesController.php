<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Room;
use Illuminate\Support\Facades\Auth;

class PagesController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    function __construct()
    {
        $this->middleware('auth')->except('index');
    }

    public function index()
    {
        $rooms = Room::allFiltered(Auth::check() ? Auth::user()->id : null)->orderBy('private', 'desc')->get();
            
        return view('index', compact('rooms'));
    }
}
