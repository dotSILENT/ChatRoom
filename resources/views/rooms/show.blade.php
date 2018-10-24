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

                <div class="card-body pt-0 pr-0">
                    <div class="row no-gutters">
                        <div class="col col-lg-10">
                            <div id="room-messages-box" class="container-fluid" style="overflow-y: auto; max-height: 600px;">
                                <div id="room-messages-top" class="d-none"></div>
                            </div>
                            <div class="input-group">
                                <input id="room-message-input" type="text" class="form-control form-control-lg" placeholder="{{ __('rooms.input') }}" autofocus>
                                <div class="input-group-append">
                                    <input id="room-message-submit" type="button" class="btn btn-outline-success" value="{{ __('rooms.submit') }}">
                                </div>
                            </div>
                        </div>
                        <div id="chatroom-users" class="col-2 h-100 d-none d-lg-block">
                            <ul class="list-group list-group-flush">
                                @foreach($room->users as $user)
                                    @if($user->id  !== Auth::user()->id)
                                    <li class="list-group-item list-group-item-action list-group-item-light p-0">
                                        <div class="row no-gutters py-2">
                                            <div class="col-2">
                                                <div style="background: red; height: 100%; width: 100%; border-radius: 50%"></div>
                                            </div>
                                            <div class="col-10 pl-1">
                                                <span>{{ $user->username }}</span>
                                            </div>
                                        </div>
                                    </li>
                                    @endif
                                @endforeach
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection