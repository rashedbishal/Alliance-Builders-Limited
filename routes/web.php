<?php

use App\Http\Controllers\CMSController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::controller(CMSController::class)->middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', 'carousel')->name('dashboard');
    Route::post('update/carousel', 'updateCarousel')->name('update-carousel');

    Route::get('project/add', 'projectAdd')->name('project-add');
    Route::post('save/project', 'saveProject')->name('save-project');

    Route::get('project/update', 'projectUpdate')->name('project-update');
    Route::get('cms/projects/by-type', 'projectByType')->name('project-by-type');
    Route::get('cms/projects/{id}/data', 'projectData')->name('project-data');
    Route::post('project/image/destroy', 'destroyProjectImage')->name('destroy-project-image');
    Route::post('update/project', 'updateProject')->name('update-project');

    Route::get('project/erase', 'projectErase')->name('project-erase');
    Route::post('destroy/project', 'destroyProject')->name('destroy-project');

    Route::get('media/add', 'mediaAdd')->name('media-add');
    Route::post('save/media', 'saveMedia')->name('save-media');

    Route::get('media/erase', 'mediaErase')->name('media-erase');
    Route::post('destroy/media', 'destroyMedia')->name('destroy-media');

    Route::get('gallery/add', 'galleryAdd')->name('gallery-add');
    Route::post('save/gallery', 'saveGallery')->name('save-gallery');

    Route::get('gallery/erase', 'galleryErase')->name('gallery-erase');
    Route::post('destroy/gallery', 'destroyGallery')->name('destroy-gallery');

    Route::get('popup/add', 'popupAdd')->name('popup-add');
    Route::post('save/popup', 'savePopup')->name('save-popup');

});

require __DIR__.'/settings.php';

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
