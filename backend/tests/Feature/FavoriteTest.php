<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_favorite(): void
    {
        $user = User::factory()->create();

        $this->authenticateUser($user);

        $response = $this->postJson('/api/favorites', [
            'nasa_type' => 'apod',
            'nasa_id' => '2026-07-15',
            'title' => 'Astronomy Picture of the Day',
            'image_url' => 'https://example.com/apod.jpg',
            'data' => [
                'date' => '2026-07-15',
                'explanation' => 'Descrição da imagem.',
            ],
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user_id', $user->id)
            ->assertJsonPath('nasa_type', 'apod')
            ->assertJsonPath('nasa_id', '2026-07-15')
            ->assertJsonPath(
                'title',
                'Astronomy Picture of the Day'
            );

        $this->assertDatabaseHas('favorites', [
            'user_id' => $user->id,
            'nasa_type' => 'apod',
            'nasa_id' => '2026-07-15',
            'title' => 'Astronomy Picture of the Day',
        ]);
    }

    public function test_favorite_requires_nasa_type(): void
    {
        $user = User::factory()->create();

        $this->authenticateUser($user);

        $response = $this->postJson('/api/favorites', [
            'nasa_id' => '2026-07-15',
            'title' => 'Favorito sem tipo',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('nasa_type');

        $this->assertDatabaseCount('favorites', 0);
    }

    public function test_duplicate_favorite_is_not_created_twice(): void
    {
        $user = User::factory()->create();

        $this->authenticateUser($user);

        $favoriteData = [
            'nasa_type' => 'epic',
            'nasa_id' => 'epic-123',
            'title' => 'Earth from EPIC',
            'image_url' => 'https://example.com/epic.jpg',
            'data' => [
                'date' => '2026-07-15',
            ],
        ];

        $firstResponse = $this->postJson(
            '/api/favorites',
            $favoriteData
        );

        $secondResponse = $this->postJson(
            '/api/favorites',
            $favoriteData
        );

        $firstResponse->assertCreated();
        $secondResponse->assertCreated();

        $this->assertDatabaseCount('favorites', 1);

        $this->assertSame(
            $firstResponse->json('id'),
            $secondResponse->json('id')
        );
    }

    public function test_user_only_lists_their_own_favorites(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Favorite::create([
            'user_id' => $user->id,
            'nasa_type' => 'apod',
            'nasa_id' => 'apod-user',
            'title' => 'Favorito do utilizador',
        ]);

        Favorite::create([
            'user_id' => $otherUser->id,
            'nasa_type' => 'epic',
            'nasa_id' => 'epic-other-user',
            'title' => 'Favorito de outro utilizador',
        ]);

        $this->authenticateUser($user);

        $response = $this->getJson('/api/favorites');

        $response
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.user_id', $user->id)
            ->assertJsonPath(
                '0.title',
                'Favorito do utilizador'
            )
            ->assertJsonMissing([
                'title' => 'Favorito de outro utilizador',
            ]);
    }

    public function test_user_can_delete_their_own_favorite(): void
    {
        $user = User::factory()->create();

        $favorite = Favorite::create([
            'user_id' => $user->id,
            'nasa_type' => 'donki',
            'nasa_id' => 'CME-2026-001',
            'title' => 'Evento DONKI',
        ]);

        $this->authenticateUser($user);

        $response = $this->deleteJson(
            "/api/favorites/{$favorite->id}"
        );

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Favorito removido com sucesso.',
            ]);

        $this->assertDatabaseMissing('favorites', [
            'id' => $favorite->id,
        ]);
    }

    public function test_user_cannot_delete_another_users_favorite(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $favorite = Favorite::create([
            'user_id' => $otherUser->id,
            'nasa_type' => 'neows',
            'nasa_id' => 'asteroid-123',
            'title' => 'Asteroide de outro utilizador',
        ]);

        $this->authenticateUser($user);

        $response = $this->deleteJson(
            "/api/favorites/{$favorite->id}"
        );

        $response
            ->assertForbidden()
            ->assertJson([
                'message' => 'Não tens permissão para apagar este favorito.',
            ]);

        $this->assertDatabaseHas('favorites', [
            'id' => $favorite->id,
            'user_id' => $otherUser->id,
        ]);
    }

    public function test_user_without_favorites_ability_cannot_access_favorites(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user, [
            'profile:read',
        ]);

        $this
            ->getJson('/api/favorites')
            ->assertForbidden();
    }

    public function test_unauthenticated_user_cannot_access_favorites(): void
    {
        $this
            ->getJson('/api/favorites')
            ->assertUnauthorized();

        $this
            ->postJson('/api/favorites', [
                'nasa_type' => 'apod',
                'nasa_id' => '2026-07-15',
            ])
            ->assertUnauthorized();
    }

    private function authenticateUser(User $user): void
    {
        Sanctum::actingAs($user, [
            'favorites:manage',
        ]);
    }
}
