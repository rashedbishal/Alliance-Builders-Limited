<?php

use App\Http\Controllers\CMSController;
use App\Http\Controllers\PageController;
use App\Models\Config\Facility;
use App\Models\Config\Location;
use App\Models\Config\ProjectType;
use App\Models\Config\Tag;
use App\Models\Visual\Gallery;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('dashboard', function () {
//    return Inertia::render('Dashboard');
    return view('test-dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('project-up', function () {
    $types = ProjectType::select('id', 'name')->get();
    $locations = Location::select('id', 'name')->get();
    $facilities = Facility::select('id', 'name')->get();
    $tags = Tag::select('id', 'name')->get();
    return view('test-project', compact('types', 'locations', 'facilities', 'tags'));
})->middleware(['auth', 'verified'])->name('project-up');

Route::get('media-up', function () {

    return view('test-media');
})->middleware(['auth', 'verified'])->name('media-up');

Route::get('gallery-up', function () {

    $types = Gallery::select('id', 'type')->get();
    return view('test-gallery', compact('types'));
})->middleware(['auth', 'verified'])->name('gallery-up');


require __DIR__.'/settings.php';



Route::controller(CMSController::class)->middleware('web')->group(function () {
    Route::post('/update-carousel', 'cImageUpdater')->name('update-carousel');
    Route::post('/save-project', 'projectSaver')->name('add-project');
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
    Route::get('/handover', 'handover')->name('handover-properties');
    Route::get('/ongoing', 'ongoing')->name('ongoing-properties');
    Route::get('/upcoming', 'upcoming')->name('upcoming-properties');
    Route::get('/hotels-resorts', 'hotelsResorts')->name('hotels-resorts');
    Route::get('{project:slug}', 'propertyDetails')->name('propertyDetails');

});
