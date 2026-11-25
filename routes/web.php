<?php

use App\Http\Controllers\CareerController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\CMSController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::controller(CMSController::class)->middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', 'carousel')->name('dashboard');
    Route::post('update/carousel', 'updateCarousel')->name('update-carousel');

    Route::get('property/add', 'propertyAdd')->name('property-add');
    Route::post('save/property', 'saveProperty')->name('save-property');

    Route::get('property/update', 'propertyUpdate')->name('property-update');
    Route::get('cms/properties/by-type', 'propertyByType')->name('property-by-type');
    Route::get('cms/properties/{id}/data', 'propertyData')->name('property-data');
    Route::post('property/image/destroy', 'destroyPropertyImage')->name('destroy-property-image');
    Route::post('update/property', 'updateProperty')->name('update-property');

    Route::get('property/remove', 'propertyRemove')->name('property-remove');
    Route::post('destroy/property', 'destroyProperty')->name('destroy-property');

    Route::get('media/add', 'mediaAdd')->name('media-add');
    Route::post('save/media', 'saveMedia')->name('save-media');

    Route::get('media/edit', 'mediaEdit')->name('media-edit');
    Route::post('update/media', 'updateMedia')->name('update-media');

    Route::get('media/remove', 'mediaRemove')->name('media-remove');
    Route::post('destroy/media', 'destroyMedia')->name('destroy-media');

    Route::get('gallery/add', 'galleryAdd')->name('gallery-add');
    Route::post('save/gallery', 'saveGallery')->name('save-gallery');

    Route::get('gallery/remove', 'galleryRemove')->name('gallery-remove');
    Route::post('destroy/gallery', 'destroyGallery')->name('destroy-gallery');

    Route::get('popup/add', 'popupAdd')->name('popup-add');
    Route::post('save/popup', 'savePopup')->name('save-popup');

    // ── Site Settings ────────────────────────────────────────────
    Route::get('cms/settings', 'settingsIndex')->name('settings-index');
    Route::post('cms/settings', 'updateSettings')->name('update-settings');
    Route::post('cms/settings/credentials', 'updateAdminCredentials')->name('update-admin-credentials');

    // ── Legal Pages ──────────────────────────────────────────────
    Route::get('cms/legal-pages', 'legalPagesIndex')->name('legal-pages-index');
    Route::post('cms/legal-pages/{slug}', 'updateLegalPage')->name('legal-pages-update');

    // ── Page Content (About / Home text & stats) ────────────────
    Route::get('cms/page-content', 'pageContentIndex')->name('page-content-index');
    Route::post('cms/page-content/{key}', 'updatePageContent')->name('page-content-update');

    // ── Testimonial Settings ─────────────────────────────────────
    Route::get('cms/testimonials', 'testimonialIndex')->name('testimonial-index');
    Route::post('testimonial/store', 'storeTestimonial')->name('testimonial-store');
    Route::post('testimonial/update', 'updateTestimonial')->name('testimonial-update');
    Route::post('testimonial/destroy', 'destroyTestimonial')->name('testimonial-destroy');

    // ── Facility Config ──────────────────────────────────────────
    Route::get('facility/add', 'facilityAdd')->name('facility-add');
    Route::post('facility/store', 'facilityStore')->name('facility-store');

    Route::get('facility/update', 'facilityUpdate')->name('facility-update');
    Route::post('facility/update', 'facilityUpdateStore')->name('facility-update-store');

    Route::get('facility/delete', 'facilityDelete')->name('facility-delete');
    Route::post('facility/destroy', 'facilityDestroy')->name('facility-destroy');

    // ── Tag Config ───────────────────────────────────────────────
    Route::get('tag/add', 'tagAdd')->name('tag-add');
    Route::post('tag/store', 'tagStore')->name('tag-store');

    Route::get('tag/update', 'tagUpdate')->name('tag-update');
    Route::post('tag/update', 'tagUpdateStore')->name('tag-update-store');

    Route::get('tag/delete', 'tagDelete')->name('tag-delete');
    Route::post('tag/destroy', 'tagDestroy')->name('tag-destroy');

    Route::get('/cms/feedback', [CMSController::class, 'feedbackIndex'])->name('feedback-index');
    Route::get('/cms/feedback/download', [CMSController::class, 'feedbackDownload'])->name('feedback-download');

});

// ── Career (CMS) ─────────────────────────────────────────────
Route::controller(CareerController::class)->middleware(['auth', 'verified'])->group(function () {

    Route::get('cms/career/settings', 'settings')->name('career-settings');
    Route::post('cms/career/settings', 'updateSettings')->name('career-settings-update');
    Route::post('cms/career/settings/remove-image', 'removeHeroImage')->name('career-settings-remove-image');

    Route::get('cms/career/jobs', 'jobs')->name('career-jobs');
    Route::post('cms/career/jobs/store', 'storeJob')->name('career-job-store');
    Route::post('cms/career/jobs/update', 'updateJob')->name('career-job-update');
    Route::post('cms/career/jobs/toggle', 'toggleJob')->name('career-job-toggle');
    Route::post('cms/career/jobs/destroy', 'destroyJob')->name('career-job-destroy');

    Route::get('cms/career/applications', 'applications')->name('career-applications');
    Route::get('cms/career/applications/{application}/cv', 'downloadCv')->name('career-application-cv');
    Route::post('cms/career/applications/destroy', 'destroyApplication')->name('career-application-destroy');

});

require __DIR__.'/settings.php';

// ── Career (public) ──────────────────────────────────────────
// Registered before the PageController group so its catch-all
// `{project:slug}` route can't swallow `/career`.
Route::controller(CareerController::class)->middleware('web')->group(function () {
    Route::get('/career', 'index')->name('career');
    Route::post('/career', 'apply')->name('career.apply');
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
    Route::get('/hotels-resorts/{project:slug}', 'hotelDetails')->name('hotel-details');
    Route::get('/privacy-policy', 'privacyPolicy')->name('privacy-policy');
    Route::get('/terms-of-service', 'termsOfService')->name('terms-of-service');
    Route::get('/refund-policy', 'refundPolicy')->name('refund-policy');
    Route::post('/contact', 'storeContact')->name('contact.store');
    Route::get('{project:slug}', 'propertyDetails')->name('propertyDetails');

});

Route::post('/chatbot', [ChatbotController::class, 'chat'])->middleware('web');

Route::get('/error-preview/{status}', function ($status) {
    $code = (int) $status;

    return Inertia::render('Error', ['status' => $code])
        ->toResponse(request())
        ->setStatusCode($code >= 400 && $code < 600 ? $code : 200);
});

Route::fallback(function () {
    return Inertia::render('Error', ['status' => 404])
        ->toResponse(request())
        ->setStatusCode(404);
});
