<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\NasaController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:auth', 'throttle:auth-per-account'])->group(function () {
    Route::post(
        '/register',
        [AuthController::class, 'register']
    );

    Route::post(
        '/login',
        [AuthController::class, 'login']
    );

    Route::post(
        '/forgot-password',
        [AuthController::class, 'forgotPassword']
    );

    Route::post(
        '/reset-password',
        [AuthController::class, 'resetPassword']
    );

    Route::post(
        '/email/resend-verification',
        [AuthController::class, 'resendVerification']
    );
});

Route::get(
    '/email/verify/{id}/{hash}',
    [AuthController::class, 'verifyEmail']
)
    ->middleware(['signed'])
    ->name('verification.verify');

Route::post(
    '/contact',
    [ContactMessageController::class, 'store']
)->middleware(['throttle:5,1', 'throttle:auth-per-account']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post(
        '/logout',
        [AuthController::class, 'logout']
    );

    Route::middleware('abilities:profile:read')->group(function () {
        Route::get(
            '/user',
            [AuthController::class, 'user']
        );
    });

    Route::middleware('abilities:profile:update')->group(function () {
        Route::patch(
            '/user/profile',
            [AuthController::class, 'updateProfile']
        );

        Route::delete(
            '/user',
            [AuthController::class, 'deleteAccount']
        );

        Route::patch(
            '/profile/nasa-api-key',
            [ProfileController::class, 'updateNasaApiKey']
        )->middleware('throttle:5,1');
    });

    Route::middleware('abilities:favorites:manage')->group(function () {
        Route::get(
            '/favorites',
            [FavoriteController::class, 'index']
        );

        Route::post(
            '/favorites',
            [FavoriteController::class, 'store']
        );

        Route::delete(
            '/favorites/{favorite}',
            [FavoriteController::class, 'destroy']
        );
    });
});

Route::prefix('nasa')
    ->middleware('throttle:60,1')
    ->group(function () {
        Route::get(
            '/apod',
            [NasaController::class, 'apod']
        );

        Route::get(
            '/epic',
            [NasaController::class, 'epic']
        );

        Route::get(
            '/epic/{date}',
            [NasaController::class, 'epicByDate']
        );

        Route::get(
            '/neo/feed',
            [NasaController::class, 'neoFeed']
        );

        Route::get(
            '/donki/{type}',
            [NasaController::class, 'donki']
        );
    });

Route::prefix('admin')
    ->middleware([
        'auth:sanctum',
        'abilities:admin:access',
        'admin',
    ])
    ->group(function () {
        Route::get('/dashboard', function () {
            return response()->json([
                'message' => 'Bem-vinda ao painel de administração.',
            ]);
        });

        Route::get(
            '/users/count',
            [AdminController::class, 'usersCount']
        );

        Route::get(
            '/users/stats',
            [AdminController::class, 'usersStats']
        );

        Route::get(
            '/favorites/stats',
            [AdminController::class, 'favoritesStats']
        );

        Route::get(
            '/messages',
            [AdminController::class, 'contactMessages']
        );

        Route::patch(
            '/messages/{message}/read',
            [AdminController::class, 'markContactMessageAsRead']
        );

        Route::delete(
            '/messages/{message}',
            [AdminController::class, 'destroyContactMessage']
        );
    });
