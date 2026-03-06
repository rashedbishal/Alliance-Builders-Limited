<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

 Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
 });

 Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
 });

Route::any('/user/confirm-password', function () {
    abort(404);
});

Route::any('/user/confirmed-password-status', function () {
    abort(404);
});

Route::middleware('web')->group(function () {

    Route::get('/register', function () {
        if (!config('app.registration_enabled')) {
            abort(404);
        }
        return app(\Laravel\Fortify\Http\Controllers\RegisteredUserController::class)->create(request());
    })->name('register');

    Route::post('/register', function () {
        if (!config('app.registration_enabled')) {
            abort(404);
        }
        return app(\Laravel\Fortify\Http\Controllers\RegisteredUserController::class)->store(request());
    })->name('register.store');

});