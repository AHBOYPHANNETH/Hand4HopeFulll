<?php

use App\Http\Controllers\Api\Admin\AdminAnalyticsController;
use App\Http\Controllers\Api\Admin\AdminContactController;
use App\Http\Controllers\Api\Admin\AdminDonationController;
use App\Http\Controllers\Api\Admin\AdminEventController;
use App\Http\Controllers\Api\Admin\AdminVolunteerRequestController;
use App\Http\Controllers\Api\Admin\AdminSiteContentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventVolunteerController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\UserVolunteerRequestController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);

Route::post('/donations', [DonationController::class, 'store']);
Route::post('/contacts', [ContactController::class, 'store']);

Route::get('/site-contents', [SiteContentController::class, 'index']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar']);
    Route::get('/my-volunteer-requests', [UserVolunteerRequestController::class, 'index']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read', [NotificationController::class, 'markRead']);

    Route::post('/events/{event}/volunteer', [EventVolunteerController::class, 'store']);

    Route::middleware('admin')->prefix('admin')->group(function (): void {
        Route::get('/analytics', AdminAnalyticsController::class);
        Route::apiResource('events', AdminEventController::class);
        Route::get('/donations', [AdminDonationController::class, 'index']);
        Route::get('/contacts', [AdminContactController::class, 'index']);
        Route::get('/site-contents', [AdminSiteContentController::class, 'index']);
        Route::put('/site-contents', [AdminSiteContentController::class, 'upsert']);
        Route::get('/volunteer-requests', [AdminVolunteerRequestController::class, 'index']);
        Route::post('/volunteer-requests/update-status', [AdminVolunteerRequestController::class, 'updateStatus']);
        Route::post('/notifications/create', [NotificationController::class, 'create']);
    });
});
