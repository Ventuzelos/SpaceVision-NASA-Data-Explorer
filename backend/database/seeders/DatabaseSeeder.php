<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        if (! app()->isLocal()) {
            throw new RuntimeException(
                'O DatabaseSeeder só pode ser executado em ambiente local.'
            );
        }

        $name = env('DEV_USER_NAME', 'Test User');
        $email = env('DEV_USER_EMAIL');
        $password = env('DEV_USER_PASSWORD');
        $role = env('DEV_USER_ROLE', 'user');

        if (! $email || ! $password) {
            throw new RuntimeException(
                'Define DEV_USER_EMAIL e DEV_USER_PASSWORD no ficheiro .env.'
            );
        }

        if (! in_array($role, ['user', 'admin'], true)) {
            throw new RuntimeException(
                'DEV_USER_ROLE deve ser "user" ou "admin".'
            );
        }

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => $password,
                'role' => $role,
            ]
        );
    }
}
