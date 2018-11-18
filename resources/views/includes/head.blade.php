<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- CSRF Token -->
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="apiToken" content="{{ Auth::user()->api_token }}">

<title>{{ config('app.name', 'ChatRoom') }}</title>

@yield('head')

<link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">
<script src="{{ asset('js/app.js') }}"></script>