@extends('layouts.master')

@section('content')
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        {{ __('rooms.create') }}
                    </div>

                    <div class="card-body">
                        <div class="col">
                            @if(count($errors))
                                @foreach($errors as $error)
                                    <p>$error</p>
                                @endforeach
                            @endif
                            <form method="POST" action="{{ route('rooms.store') }}">
                                @csrf
                                <div class="form-group row">
                                    <label for="roomName">{{ __('rooms.name') }}</label>
                                    <input type="input" class="form-control" name="roomName" id="roomName" placeholder="{{ __('rooms.name') }}" aria-describedby="roomNameDesc" required>
                                    <small id="roomNameDesc" class="form-text text-muted">{{ __('rooms.namedesc') }}</small>
                                </div>
                                <div class="form-group row">
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" name="private" id="private">
                                        <label class="custom-control-label" for="private">{{ __('rooms.private') }}</label>
                                    </div>
                                </div>
                                <div class="form-group row justify-content-center">
                                    <div class="col-sm-4">
                                        <input type="submit" class="btn btn-block btn-success" value="{{ __('rooms.create') }}">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
@endsection