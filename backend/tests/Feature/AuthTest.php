<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_with_valid_data(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Ângela Pereira',
            'email' => 'angela@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                ],
                'token',
            ])
            ->assertJsonPath('user.name', 'Ângela Pereira')
            ->assertJsonPath('user.email', 'angela@example.com');

        $this->assertDatabaseHas('users', [
            'name' => 'Ângela Pereira',
            'email' => 'angela@example.com',
        ]);

        $user = User::where('email', 'angela@example.com')->first();

        $this->assertNotNull($user);
        $this->assertTrue(
            Hash::check('Password123', $user->password)
        );
    }

    public function test_registration_rejects_duplicate_email(): void
    {
        User::factory()->create([
            'email' => 'angela@example.com',
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'Outra Utilizadora',
            'email' => 'angela@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->assertDatabaseCount('users', 1);
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
