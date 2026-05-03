<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\UserController;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

use App\Http\Controllers\LandingContentController;

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('/structure', [UserController::class, 'index'])->name('structure');
    Route::resource('users', UserController::class)->except(['index']);

    // Landing Content Management
    Route::get('/landing-content', [LandingContentController::class, 'index'])->name('landing.content');
    Route::post('/landing-content', [LandingContentController::class, 'update'])->name('landing.content.update');
    Route::post('/landing-content/upload', [LandingContentController::class, 'uploadImage'])->name('landing.content.upload');

    // Works Management
    Route::get('/works', [\App\Http\Controllers\WorkController::class, 'index'])->name('works.index');
    Route::resource('works', \App\Http\Controllers\WorkController::class)->except(['index']);

    // Intern Tracking Management
    Route::resource('track-interns', \App\Http\Controllers\TrackInternController::class);

    // Story Management
    Route::post('/stories/update-content', [\App\Http\Controllers\StoryController::class, 'updateContent'])->name('stories.updateContent');
    Route::resource('stories', \App\Http\Controllers\StoryController::class);

    // Live Preview
    Route::get('/preview', function () {
        return Inertia::render('preview');
    })->name('preview');
});

Route::prefix('/api')->group(function () {
    Route::get('/get-users', [UserController::class, 'getAPIUser'])->name('users.getAPIUser');
    Route::get('/get-landing-content', [LandingContentController::class, 'apiIndex'])->name('landing.getAPIContent');
    Route::get('/get-works', [\App\Http\Controllers\WorkController::class, 'apiIndex'])->name('works.getAPIWorks');
    Route::get('/get-interns', [\App\Http\Controllers\TrackInternController::class, 'apiIndex'])->name('interns.getAPIInterns');
    Route::get('/get-stories', [\App\Http\Controllers\StoryController::class, 'apiIndex'])->name('stories.getAPIStories');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
