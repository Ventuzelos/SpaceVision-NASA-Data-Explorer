<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_request_password_reset_link(): void
    {
        Notification::fake();

        $user = User::factory()->create([
            'email' => 'angela@example.com',
        ]);

        $response = $this->postJson('/api/forgot-password', [
            'email' => 'angela@example.com',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'message',
            ]);

        Notification::assertSentTo(
            $user,
            ResetPassword::class
        );
    }

    public function test_password_reset_request_requires_valid_email(): void
    {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'email-invalido',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_password_reset_request_does_not_reveal_unknown_email(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/forgot-password', [
            'email' => 'naoexiste@example.com',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Se existir uma conta com esse email, será enviado um link para repor a palavra-passe.',
            ]);

        Notification::assertNothingSent();
    }

    public function test_user_can_reset_password_with_valid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'angela@example.com',
            'password' => Hash::make('PasswordAntiga123'),
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/reset-password', [
            'email' => 'angela@example.com',
            'token' => $token,
            'password' => 'PasswordNova123',
            'password_confirmation' => 'PasswordNova123',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'message',
            ]);

        $user->refresh();

        $this->assertTrue(
            Hash::check('PasswordNova123', $user->password)
        );

        $this->assertFalse(
            Hash::check('PasswordAntiga123', $user->password)
        );
    }

    public function test_password_reset_rejects_invalid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'angela@example.com',
        ]);

        $response = $this->postJson('/api/reset-password', [
            'email' => 'angela@example.com',
            'token' => 'token-invalido',
            'password' => 'PasswordNova123',
            'password_confirmation' => 'PasswordNova123',
        ]);

        $response->assertUnprocessable();
    }

    public function test_password_reset_requires_matching_confirmation(): void
    {
        $user = User::factory()->create([
            'email' => 'angela@example.com',
        ]);

        $token = Password::createToken($user);

        $response = $this->postJson('/api/reset-password', [
            'email' => 'angela@example.com',
            'token' => $token,
            'password' => 'PasswordNova123',
            'password_confirmation' => 'OutraPassword123',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('password');
    }
}
