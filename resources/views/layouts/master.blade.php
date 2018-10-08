<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        @include('includes.head')
    </head>
    <body>
        @include('includes.navbar')

        <div class="container" style="padding-top: 20px">
            @yield('content')
        </div>
    </body>
</html>
