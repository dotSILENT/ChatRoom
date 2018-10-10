<nav class="navbar navbar-expand-lg navbar-chatroom shadow-sm navbar-dark">
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
                        <a class="dropdown-item" href="{{ route('logout') }}">{{ __('auth.logout') }}</a>
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
                                    <input id="login" type="text" class="form-control" name="login" placeholder="{{ __('auth.credentials') }}" required autofocus>
                                </div>

                                <div class="form-group row">
                                    <input id="password" type="password" class="form-control" name="password" placeholder="{{ __('auth.password') }}" required>
                                </div>

                                <div class="form-group row">
                                        <div class="custom-control custom-checkbox">
                                            <input class="custom-control-input" type="checkbox" name="remember" id="remember">

                                            <label class="custom-control-label" for="remember">
                                                {{ __('auth.remember') }}
                                            </label>
                                        </div>
                                </div>

                                <div class="form-group row mb-0">
                                        <button type="submit" class="btn btn-block btn-primary">
                                            {{ __('auth.login') }}
                                        </button>

                                        <a class="btn btn-link" href="{{ route('password.request') }}">
                                            {{ __('auth.forgot') }}
                                        </a>
                                </div>
                            </form>
                        </div>
                    </div> 
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="register">{{ __('auth.register') }}</a>
                </li>
            @endif
            </ul>
        </div>
    </div>
</nav>