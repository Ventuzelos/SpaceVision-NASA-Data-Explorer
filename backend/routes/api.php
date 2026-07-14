<?php

use App\Http\Controllers\Api\NasaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\ContactMessageController;

Route::middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::post(
        '/forgot-password',
        [AuthController::class, 'forgotPassword']
    );

    Route::post(
        '/reset-password',
        [AuthController::class, 'resetPassword']
    );
});

Route::post('/contact', [ContactMessageController::class, 'store'])
    ->middleware('throttle:5,1');


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{favorite}', [FavoriteController::class, 'destroy']);
});


Route::prefix('nasa')->middleware('throttle:60,1')->group(function () {
    Route::get('/apod', [NasaController::class, 'apod']);
    Route::get('/epic', [NasaController::class, 'epic']);
    Route::get('/epic/{date}', [NasaController::class, 'epicByDate']);
    Route::get('/neo/feed', [NasaController::class, 'neoFeed']);
    Route::get('/donki/{type}', [NasaController::class, 'donki']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Bem-vinda ao painel de administração.',
        ]);
    });
});

Route::prefix('admin')
    ->middleware(['auth:sanctum', 'admin'])
    ->group(function () {
        Route::get(
            '/users/count',
            [AdminController::class, 'usersCount']
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
