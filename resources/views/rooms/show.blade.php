@extends('layouts.master')

@section('head')
    <meta name="roomID" content="{{ $room->id }}">
    <meta name="apiToken" content="{{ Auth::user()->api_token }}">
    <script src="{{ asset('js/room_chat.js') }}"></script>
@endsection

@section('content')
    <div  class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    {{ $room->name }}
                </div>

                <div class="card-body pt-0 pb-0">
                    <div class="row h-100">
                        <div class="col pl-0 pr-0">
                            <div id="room-messages-box" style="overflow-y: auto; overflow-x: hidden; max-height: 600px;">
                                <div id="room-messages-top" class="d-none"></div>
                            </div>
                            <div class="input-group mt-2 mb-2 pr-2">
                                <input id="room-message-input" type="text" class="form-control" placeholder="{{ __('rooms.input') }}" autofocus>
                                <div class="input-group-append">
                                    <input id="room-message-submit" type="button" class="btn btn-success" value="{{ __('rooms.submit') }}">
                                </div>
                            </div>
                        </div>
                        <div id="chatroom-users" class="col-2 h-100 d-none d-lg-block">
                            @foreach($room->users as $user)
                                @if($user->id  !== Auth::user()->id)
                                    <p>{{ $user->username }}</p>
                                @endif
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection