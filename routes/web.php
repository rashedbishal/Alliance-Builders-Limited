<?php

use App\Http\Controllers\CMSController;
use App\Http\Controllers\PageController;
use App\Models\Visual\Gallery;
use Illuminate\Support\Facades\Route;


Route::get('media-up', function () {

    return view('test-media');
})->middleware(['auth', 'verified'])->name('media-up');

Route::get('gallery-up', function () {

    $types = Gallery::select('id', 'type')->get();

    return view('test-gallery', compact('types'));
})->middleware(['auth', 'verified'])->name('gallery-up');

require __DIR__.'/settings.php';

Route::controller(CMSController::class)->middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', 'carousel')->name('dashboard');
    Route::post('/update-carousel', 'updateCarousel')->name('update-carousel');

    Route::get('project/add', 'projectAdd')->name('project-add');
    Route::post('/save-project', 'saveProject')->name('save-project');

    Route::get('project/update', 'projectUpdate')->name('project-update');
    Route::get('/cms/projects/by-type', 'projectByType')->name('project-by-type');
    Route::get('/cms/projects/{id}/data', 'projectData')->name('project-data');



    Route::post('/save-media', 'mediaSaver')->name('add-media');
    Route::post('/save-gallery', 'gallerySaver')->name('add-gallery');



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
    Route::get('/handover', 'properties')->name('handover-properties');
    Route::get('/ongoing', 'properties')->name('ongoing-properties');
    Route::get('/upcoming', 'properties')->name('upcoming-properties');
    Route::get('/hotels-resorts', 'hotelsResorts')->name('hotels-resorts');
    Route::get('{project:slug}', 'propertyDetails')->name('propertyDetails');

});
