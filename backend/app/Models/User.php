<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmailContract
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, MustVerifyEmail, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'nasa_api_key',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'nasa_api_key',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'nasa_api_key' => 'encrypted',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
}
