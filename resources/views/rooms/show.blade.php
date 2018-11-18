@extends('layouts.master')

@section('head')
    <meta name="roomID" content="{{ $room->id }}">
@endsection

@section('bottomscripts')
<script src="{{ asset('js/room_chat.js') }}"></script>
@endsection

@section('content')
    <div  class="row">
        <div class="col-12">
            <div id="room-messages-card" class="card">
                <div class="card-header">
                    {{ $room->name }}
                </div>

                <div class="card-body pt-0 pr-0">
                    <div class="row no-gutters">
                        <div class="col col-lg-10">
                            <div id="room-messages-box" class="container-fluid">
                                <div id="room-messages-top" class="d-none"></div>
                            </div>
                            <div class="input-group">
                                <input id="room-message-input" type="text" class="form-control form-control-lg" placeholder="{{ __('rooms.input') }}" autofocus>
                                <div class="input-group-append">
                                    <input id="room-message-submit" type="button" class="btn btn-outline-success" value="{{ __('rooms.submit') }}">
                                </div>
                            </div>
                        </div>
                        <div id="room-users" class="col-2 h-100 d-none d-lg-block">
                            <ul class="list-group list-group-flush">
                                @foreach($room->users as $user)
                                    <li class="list-group-item list-group-item-action list-group-item-light p-0">
                                        <div class="row no-gutters py-2">
                                            <div class="col-2">
                                                <img src="{{ asset('storage/'. config('app.avatars_dir') . '/' . $user->avatar) }}" class="rounded-circle avatar-fluid">
                                            </div>
                                            <div class="col-10 pl-1 room-users-username">
                                                <span>{{ $user->username }}</span>
                                            </div>
                                        </div>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection