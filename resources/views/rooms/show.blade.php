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
                        <div class="col">
                            <div id="room-messages-box" style="overflow-y: auto; max-height: 600px;">
                            </div>
                            <div>
                                <div class="input-group mt-2 mb-2">
                                    <input id="room-message-input" type="text" class="form-control" placeholder="{{ __('rooms.input') }}" autofocus>
                                    <div class="input-group-append">
                                        <input id="room-message-submit" type="button" class="btn btn-success" value="{{ __('rooms.submit') }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="chatroom-users" class="col-2 h-100 d-none d-lg-block">
                            Uzytkownicy
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection