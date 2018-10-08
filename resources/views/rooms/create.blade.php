@extends('layouts.master')

@section('content')
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        Stwórz nowy pokój czatowy
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
                                    <label for="roomName">Nazwa nowego pokoju</label>
                                    <input type="input" class="form-control" name="roomName" id="roomName" placeholder="Nazwa pokoju" aria-describedby="roomNameDesc" required>
                                    <small id="roomNameDesc" class="form-text text-muted">Powinna opisywać tematykę Twojego kanału</small>
                                </div>
                                <div class="form-group row">
                                    <div class="custom-control custom-checkbox">
                                        <input type="checkbox" class="custom-control-input" name="private" id="private">
                                        <label class="custom-control-label" for="private">Pokój prywatny. Dołączyć mogą tylko zaproszone osoby</label>
                                    </div>
                                </div>
                                <div class="form-group row justify-content-center">
                                    <div class="col-sm-4">
                                        <input type="submit" class="btn btn-block btn-success" value="Dodaj pokój">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
@endsection