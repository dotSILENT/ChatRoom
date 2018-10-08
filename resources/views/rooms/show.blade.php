@extends('layouts.master')

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
                            <div style="overflow-y: scroll; max-height: 600px;">
                                @for ($i = 0; $i < 15; $i++)
                                    <div class="alert alert-secondary">
                                        Test message
                                    </div>
                                @endfor
                            </div>
                            <div>
                                <div class="input-group mt-2 mb-2">
                                    <input type="text" class="form-control" placeholder="{{ __('rooms.input') }}" autofocus>
                                    <div class="input-group-append">
                                        <input type="button" class="btn btn-success" value="{{ __('rooms.submit') }}">
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