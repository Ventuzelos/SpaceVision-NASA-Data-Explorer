<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth', function ($request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        ResetPassword::createUrlUsing(
    function (object $notifiable, string $token): string {
        $frontendUrl = rtrim(
            (string) config('app.frontend_url'),
            '/'
        );

        return $frontendUrl
            . '/reset-password?token='
            . urlencode($token)
            . '&email='
            . urlencode($notifiable->getEmailForPasswordReset());
    }
);
    }
}
