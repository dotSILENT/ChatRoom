<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'ChatRoom') }}</title>

        <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">
        <script src="{{ asset('js/app.js') }}"></script>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-chatroom navbar-dark">
            <div class="container">
                <a class="navbar-brand" href="{{ route('home') }}">{{ config('app.name', 'ChatRoom') }}</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarLinks" aria-controls="navbarLinks" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarLinks">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <a class="nav-link" href="{{ route('home') }}">{{ __('home.index') }}</a>
                        </li>
                    </ul>
                    
                    <ul class="navbar-nav ml-auto">
                    @if(Auth::check())
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="user-dropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{ Auth::user()->username }}
                            </a>
                            <div  class="dropdown-menu" aria-labelledby="user-dropdown">
                                <a class="dropdown-item" href="{{ route('logout') }}">{{ __{'auth.logout') }}/a>
                            </div>
                        </li>
                    @else
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="{{ route('login') }}" id="login-dropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{ __('auth.login') }}
                            </a>
                            <div class="dropdown-menu" aria-labelledby="login-dropdown">
                                <div class="container-fluid" style="padding: 0px 30px 0px 30px; min-width: 250px">
                                <form method="POST" action="{{ route('login') }}">
                                    @csrf

                                    <div class="form-group row">
                                        <input id="login" type="text" class="form-control" name="login" placeholder="E-mail lub nazwa użytkownika" required autofocus>
                                    </div>

                                    <div class="form-group row">
                                        <input id="password" type="password" class="form-control" name="password" placeholder="Hasło" required>
                                    </div>

                                    <div class="form-group row">
                                            <div class="custom-control custom-checkbox">
                                                <input class="custom-control-input" type="checkbox" name="remember" id="remember">

                                                <label class="custom-control-label" for="remember">
                                                    {{ __('Remember Me') }}
                                                </label>
                                            </div>
                                    </div>

                                    <div class="form-group row mb-0">
                                            <button type="submit" class="btn btn-block btn-primary">
                                                {{ __('Login') }}
                                            </button>

                                            <a class="btn btn-link" href="{{ route('password.request') }}">
                                                {{ __('Forgot Your Password?') }}
                                            </a>
                                    </div>
                                </form>
                                </div>
                            </div> 
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="register">Zarejestruj się</a>
                        </li>
                    @endif
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container" style="padding-top: 20px">
            @yield('content')
        </div>
    </body>
</html>
