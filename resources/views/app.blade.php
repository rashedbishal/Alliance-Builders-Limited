<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @viteReactRefresh
    @routes
    @vite(['resources/css/app.css','resources/js/app.tsx'])
    @inertiaHead
</head>
<body>
@inertia
</body>
</html>
