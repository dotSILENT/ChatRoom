<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display users public profile
     *
     * @param  int  $id User ID or @me for self
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if($id === '@me')
            $user = Auth::user();
        else $user = User::findOrFail($id);

        return view('users.show', compact('user'));
    }

    /**
     * Show the form for editing own (or someone's else if allowed) profile
     *
     * @param  int  $id User ID or @me for self
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if($id === '@me')
            $user = Auth::user();
        else $user = User::findOrFail($id);

        return view('users.edit', compact('user'));
    }

    /**
     * Update the users profile
     *
     * @param Request $request
     * @param int $id User ID or @me for self
     * @return void
     */
    public function update(Request $request, $id)
    {
        if($id === '@me')
            $user = Auth::user();
        else $user = User::findOrFail($id);

        return redirect()->route('users.edit', $id);
    }

}
