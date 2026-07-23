<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\ExistingAccountRegistrationAttempted;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_data(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/register', [
            'name' => 'Ângela Pereira',
            'email' => 'angela@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonMissing(['token'])
            ->assertJsonStructure(['message']);

        $this->assertDatabaseHas('users', [
            'name' => 'Ângela Pereira',
            'email' => 'angela@example.com',
            'email_verified_at' => null,
        ]);

        $user = User::where('email', 'angela@example.com')->first();

        $this->assertNotNull($user);
        $this->assertTrue(
            Hash::check('Password123', $user->password)
        );

        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_registration_with_existing_email_does_not_duplicate_or_reveal(): void
    {
        Notification::fake();

        $existingUser = User::factory()->create([
            'email' => 'angela@example.com',
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'Outra Utilizadora',
            'email' => 'angela@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        // Mesma resposta (201 + mensagem genérica) quer o email já
        // exista quer não - não deve dar para distinguir os dois
        // casos (finding F5 da auditoria de segurança).
        $response
            ->assertCreated()
            ->assertJsonMissing(['token'])
            ->assertJsonStructure(['message']);

        $this->assertDatabaseCount('users', 1);

        Notification::assertSentTo(
            $existingUser,
            ExistingAccountRegistrationAttempted::class
        );
    }

    public function test_user_can_verify_email_with_valid_signed_link(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->email),
            ]
        );

        $response = $this->get($verificationUrl);

        $response->assertRedirect(
            rtrim((string) config('app.frontend_url'), '/')
                .'/login?verified=1'
        );

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_email_verification_rejects_invalid_hash(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => 'hash-errado',
            ]
        );

        $response = $this->get($verificationUrl);

        $response->assertForbidden();
        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_resend_verification_is_generic_for_unknown_email(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/email/resend-verification', [
            'email' => 'nao-existe@example.com',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure(['message']);

        Notification::assertNothingSent();
    }

    public function test_resend_verification_sends_for_unverified_account(): void
    {
        Notification::fake();

        $user = User::factory()->unverified()->create();

        $response = $this->postJson('/api/email/resend-verification', [
            'email' => $user->email,
        ]);

        $response->assertOk();

        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_registration_requires_valid_data(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'email-invalido',
            'password' => '123',
            'password_confirmation' => '456',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
                'password',
            ]);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'angela@example.com',
            'password' => Hash::make('Password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'angela@example.com',
            'password' => 'Password123',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                ],
                'token',
            ])
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', 'angela@example.com');

        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'angela@example.com',
            'password' => Hash::make('Password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'angela@example.com',
            'password' => 'PalavraPasseErrada',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email')
            ->assertJsonPath(
                'errors.email.0',
                'Os dados de acesso estão incorretos.'
            );

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();

        $token = $user
            ->createToken('spacevision-token')
            ->plainTextToken;

        $response = $this
            ->withToken($token)
            ->postJson('/api/logout');

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Sessão terminada com sucesso.',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_unauthenticated_user_cannot_access_user_route(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_get_own_data(): void
    {
        $user = User::factory()->create([
            'name' => 'Ângela Pereira',
            'email' => 'angela@example.com',
        ]);

        Sanctum::actingAs($user, [
            'profile:read',
        ]);

        $response = $this->getJson('/api/user');

        $response
            ->assertOk()
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('name', 'Ângela Pereira')
            ->assertJsonPath('email', 'angela@example.com');
    }
}
