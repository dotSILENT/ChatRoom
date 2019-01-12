<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        @include('includes.head')
    </head>
    <body>
        @include('includes.navbar')

        <div class="container pt-2" id="bodyContainer">
            @yield('content')
        </div>
        @yield('bottomscripts')
    </body>
</html>
