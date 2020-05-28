<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
    	@yield('title')
	    <!-- CSRF Token -->
		<meta name="csrf-token" content="{{ csrf_token() }}">
        @include('head')
        @yield('styles')
    </head>
    <body>
    	@include('navbar')
    	@yield('content')
    	@include('footer')
    	<script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" crossorigin="anonymous" defer></script>
    	<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js" crossorigin="anonymous" defer></script>
    	@yield('scripts')
    </body>
</html>