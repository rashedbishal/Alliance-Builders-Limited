<?php

use App\Http\Controllers\CMSController;
use App\Http\Controllers\PageController;
use App\Models\Config\Location;
use App\Models\Config\ProjectType;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('dashboard', function () {
//    return Inertia::render('Dashboard');
    return view('test-dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('project-up', function () {
    $types = ProjectType::select('id', 'name')->get();
    $locations = Location::select('id', 'name')->get();
    return view('test-project', compact('types', 'locations'));
})->middleware(['auth', 'verified'])->name('project-up');

require __DIR__.'/settings.php';



Route::controller(CMSController::class)->middleware('web')->group(function () {
    Route::post('/update-carousel', 'cImageUpdater')->name('update-carousel');
    Route::post('/save-project', 'projectSaver')->name('add-project');
});


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
