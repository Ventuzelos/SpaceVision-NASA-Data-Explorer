<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

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
        Event::listen(
            Registered::class,
            SendEmailVerificationNotification::class
        );

        RateLimiter::for('auth', function ($request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Limite adicional por email/conta, para além do limite por IP:
        // um atacante distribuído por vários IPs não consegue contornar
        // o rate-limit só porque muda de endereço (mitigação para F5/F8).
        RateLimiter::for('auth-per-account', function ($request) {
            $email = mb_strtolower((string) $request->input('email', ''));

            return Limit::perMinutes(10, 10)
                ->by($email !== '' ? $email : $request->ip());
        });

        ResetPassword::createUrlUsing(
            function (object $notifiable, string $token): string {
                $frontendUrl = rtrim(
                    (string) config('app.frontend_url'),
                    '/'
                );

                return $frontendUrl
                    .'/reset-password?token='
                    .urlencode($token)
                    .'&email='
                    .urlencode($notifiable->getEmailForPasswordReset());
            }
        );
    }
}
