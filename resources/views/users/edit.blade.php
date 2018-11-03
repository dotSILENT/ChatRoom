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
                                    <div class="row">
                                        <div class="col-lg-3">
                                            <h5>{{ __('Avatar') }}</h5>
                                            <div style="background: black; height:100px; width:100px; border-radius: 50%"></div>
                                        </div>
                                        <div class="col-lg-9">
                                            <label for="displayname">{{ __('user.displayname') }}</label>
                                            <input type="text" id="displayname" name="displayname" class="form-control" value="{{ $user->displayName() }}" aria-describedby="displaynameHelp" required>
                                            <small id="displaynameHelp" class="form-text text-muted">{{ __('user.displayname_help') }}</small>
                                            
                                            <label for="email">{{ __('E-Mail') }}</label>
                                            <input type="text" id="email" name="email" class="form-control" value="{{ $user->email }}" required>

                                            <label for="password" class="mt-5">{{ __('user.confirm_password') }}</label>
                                            <input type="password" id="password" name="password" class="form-control" required>
                                        </div>
                                    </div>
                                    <div class="text-right mt-2">
                                        <button type="submit" class="btn btn-outline-success">{{ __('user.save') }}</button>
                                    </div>
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