@extends('layouts.master')

@section('content')
<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-4 col-xl-3">
                        <div class="list-group" id="profile-tab" role="tablist">
                            <a class="list-group-item list-group-item-action active" id="list-account-list" data-toggle="list" href="#list-account" role="tab" aria-controls="home">{{ __('user.account') }}</a>
                            <a class="list-group-item list-group-item-action" id="list-privacy-list" data-toggle="list" href="#list-privacy" role="tab" aria-controls="profile">{{ __('user.privacy') }}</a>
                        </div>
                    </div>
                    <div class="col-sm-8 col-xl-9">
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade show active" id="list-account" role="tabpanel" aria-labelledby="list-account-list">
                                <div class="card card-body bg-light">
                                    <form action="{{ route('users.update', ($user->id == Auth::user()->id) ? '@me' : $user->id) }}" method="POST" enctype="multipart/form-data">
                                        @csrf
                                        @method('put')
                                        <div class="row">
                                            <div class="col text-center">
                                                <img id="avatarPreview" src="{{ asset('storage/avatars/'. $user->avatar) }}" class="rounded-circle avatar-big">
                                                <div class="btn-group-vertical mt-2" role="group">
                                                    <label class="btn btn-outline-primary">
                                                        {{ __('user.avatar_change') }}
                                                        <input type="file" id="avatar" name="avatar" accept="image/png,image/gif,image/jpeg" class="d-none" onchange="onAvatarChange(this)" hidden>
                                                    </label>
                                                    <input type="checkbox" id="deleteAvatar" name="delete_avatar" value="false" class="d-none" hidden>
                                                    <button type="button" class="btn btn-outline-danger" onclick="onDeleteAvatar()">{{ __('user.avatar_delete') }}</button>
                                                </div>
                                            </div>
                                            <div class="col-12 col-lg-auto">
                                                <div class="form-group">
                                                    <label for="displayname">{{ __('user.displayname') }}</label>
                                                    <input type="text" id="displayname" name="displayname" class="form-control" value="{{ $user->displayName() }}" aria-describedby="displaynameHelp">
                                                    <small id="displaynameHelp" class="form-text text-muted">{{ __('user.displayname_help') }}</small>
                                                </div>

                                                <div class="form-group">
                                                    <label for="email">{{ __('E-Mail') }}</label>
                                                    <input type="text" id="email" name="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" value="{{ $user->email }}" required>
                                                    @if ($errors->has('email'))
                                                        <span class="invalid-feedback" role="alert">
                                                            <strong>{{ $errors->first('email') }}</strong>
                                                        </span>
                                                    @endif
                                                </div>

                                                <div class="form-group mt-5">
                                                    <label for="currentpass">{{ __('user.current_password') }}</label>
                                                    <input type="password" id="currentpass" name="currentpass" class="form-control{{ $errors->has('currentpass') ? ' is-invalid' : '' }}" required>
                                                    @if ($errors->has('currentpass'))
                                                        <span class="invalid-feedback" role="alert">
                                                            <strong>{{ $errors->first('currentpass') }}</strong>
                                                        </span>
                                                    @endif
                                                </div>
                                                <div class="form-group">
                                                    <button type="button" class="btn btn-primary btn-sm" data-toggle="collapse" data-target="#passwordChange">Zmiana hasła</button>
                                                    <div class="collapse {{$errors->has('newpass') ? 'show' : '' }}" id="passwordChange">
                                                        <div class="form-group">
                                                            <label for="newpass">{{ __('user.new_password') }}</label>
                                                            <input type="password" id="newpass" name="newpass" class="form-control{{ $errors->has('newpass') ? ' is-invalid' : '' }}">
                                                            @if ($errors->has('newpass'))
                                                                <span class="invalid-feedback" role="alert">
                                                                    <strong>{{ $errors->first('newpass') }}</strong>
                                                                </span>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-right mt-2">
                                            <button type="submit" class="btn btn-outline-success">{{ __('user.save') }}</button>
                                        </div>
                                        <script>
                                            function onAvatarChange(input)
                                            {
                                                if(input.files[0].type.startsWith('image/'))
                                                    document.getElementById('avatarPreview').src = URL.createObjectURL(input.files[0])
                                                else document.getElementById('avatar').value = ""; // clear file
                                            }
                                            function onDeleteAvatar()
                                            {
                                                let check = document.getElementById('deleteAvatar');
                                                check.checked = true;
                                                check.value = "true";
                                                document.getElementById('avatarPreview').src = '/storage/avatars/default.jpg';
                                            }
                                        </script>
                                    </form>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="list-privacy" role="tabpanel" aria-labelledby="list-privacy-list">
                                {{ __('user.privacy') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection