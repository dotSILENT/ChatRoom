@extends('layouts.master')

@section('content')
    <div class="alert alert-info">
        <h4 class="alert-heading">{{ __('home.welcome') }}</h4>
        <p class="mb-0">{{ __('home.selectroom') }}</p>
    </div>

    <div class="row" style="padding-bottom: 20px;">
        <div class="col-md-6 col-sm-8 mx-auto">
            <a href="/rooms/create" class="btn btn-primary btn-block">{{ __('rooms.create') }}</a>
        </div>
    </div>

    @foreach($rooms as $room)
        <div class="card mb-1 {{ $room->private ? 'border-warning' : '' }}">
            <div class="card-body">
                <div class="row">
                    <div class="col-10">
                        <h5>{{ $room->name }}</h5>
                        <h6 class="card-subtitle text-muted">{{ __('rooms.createdby') . ' ' . $room->owner->username }}</h6>
                    </div>
                    <div class="col col-xs-2">
                        <a href="{{ route('rooms.show', $room->id) }}" class="btn btn-success btn-block">{{ __('rooms.join') }}</a>
                    </div>
                </div>
            </div>
        </div>
    @endforeach
@endsection