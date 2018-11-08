<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;

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
        
        $request->validate([
            'currentpass' => 'required|string',
            'newpass' => 'nullable|string|min:6',
            'email' => 'nullable|email|unique:users,email,'. $user->id,
            'displayname' => 'nullable|string',
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if(!Hash::check($request->input('currentpass'), $user->password))
            return back()->withErrors(['currentpass' => __('user.invalid_password')]);

        if($request->has('displayname'))
        {
            if(!empty($request->input('displayname')))
                $user->nickname = $request->input('displayname');
            else $user->nickname = null;
        }

        if($request->has('email'))
            $user->email = $request->input('email');
        
        if($request->has('newpass') && !empty($request->input('newpass')))
            $user->password = Hash::make($request->input('newpass'));

        // Handle avatar upload
        if($request->hasFile('avatar') && $request->file('avatar')->isValid())
        {
            if($user->avatar != 'default.jpg')
            {
                // delete previous file
                Storage::disk('public')->delete('avatars/'. $user->avatar);
            }

            // generate a unique name for the avatar
            $user->avatar = 'avatar_'. str_random(5) .'_'. Carbon::now()->timestamp .'.'. $request->file('avatar')->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('avatars', $request->file('avatar'), $user->avatar);
        }

        $user->update();

        return back();
    }

}