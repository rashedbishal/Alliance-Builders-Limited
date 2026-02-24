<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::controller(PageController::class)->middleware('web')->group(function () {

    Route::get('/', 'home')->name('home');
    Route::get('/about', 'about')->name('about');
    Route::get('/services', 'services')->name('services');
    Route::get('/contact', 'contact')->name('contact');
    Route::get('/directors', 'directors')->name('directors');
    Route::get('/directors/{id}', 'directorDetails')->name('directorDetails');
    Route::get('/managing-director', 'managingDirector')->name('managingDirector');
    Route::get('/media', 'media')->name('media');
    Route::get('/gallery', 'gallery')->name('gallery');
    Route::get('/properties', 'properties')->name('properties');
    Route::get('{project:slug}', 'propertyDetails')->name('propertyDetails');

});

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
