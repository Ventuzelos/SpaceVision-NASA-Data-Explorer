<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ContactAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_message_can_be_created(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'Ângela Pereira',
            'email' => 'angela@example.com',
            'subject' => 'Pedido de informação',
            'message' => 'Gostaria de obter mais informações sobre o projeto.',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath(
                'message',
                'Mensagem enviada com sucesso.'
            )
            ->assertJsonPath(
                'data.email',
                'angela@example.com'
            );

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Ângela Pereira',
            'email' => 'angela@example.com',
            'subject' => 'Pedido de informação',
            'is_read' => false,
        ]);
    }

    public function test_contact_message_rejects_invalid_data(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => '1',
            'email' => 'email-invalido',
            'subject' => 'Oi',
            'message' => 'Curta',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
                'subject',
                'message',
            ]);

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_normal_user_cannot_access_admin_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertForbidden();
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/dashboard');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'message',
            ]);
    }

    public function test_admin_can_list_contact_messages(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        ContactMessage::create([
            'name' => 'Primeiro Utilizador',
            'email' => 'primeiro@example.com',
            'subject' => 'Primeira mensagem',
            'message' => 'Esta é a primeira mensagem de contacto.',
            'is_read' => false,
        ]);

        ContactMessage::create([
            'name' => 'Segundo Utilizador',
            'email' => 'segundo@example.com',
            'subject' => 'Segunda mensagem',
            'message' => 'Esta é a segunda mensagem de contacto.',
            'is_read' => true,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/messages');

        $response
            ->assertOk()
            ->assertJsonPath('total', 2)
            ->assertJsonPath('unread', 1)
            ->assertJsonCount(2, 'messages');
    }

    public function test_admin_can_mark_contact_message_as_read(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $message = ContactMessage::create([
            'name' => 'Utilizador Teste',
            'email' => 'teste@example.com',
            'subject' => 'Mensagem por ler',
            'message' => 'Esta mensagem ainda não foi lida pelo administrador.',
            'is_read' => false,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->patchJson(
            "/api/admin/messages/{$message->id}/read"
        );

        $response
            ->assertOk()
            ->assertJsonPath(
                'message',
                'Mensagem marcada como lida.'
            )
            ->assertJsonPath('data.is_read', true);

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'is_read' => true,
        ]);
    }

    public function test_admin_can_delete_contact_message(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $message = ContactMessage::create([
            'name' => 'Utilizador Teste',
            'email' => 'teste@example.com',
            'subject' => 'Mensagem a eliminar',
            'message' => 'Esta mensagem será eliminada pelo administrador.',
            'is_read' => false,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->deleteJson(
            "/api/admin/messages/{$message->id}"
        );

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Mensagem eliminada com sucesso.',
            ]);

        $this->assertDatabaseMissing('contact_messages', [
            'id' => $message->id,
        ]);
    }

    public function test_normal_user_cannot_manage_contact_messages(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $message = ContactMessage::create([
            'name' => 'Utilizador Teste',
            'email' => 'teste@example.com',
            'subject' => 'Mensagem protegida',
            'message' => 'Esta mensagem não pode ser alterada por utilizadores.',
            'is_read' => false,
        ]);

        Sanctum::actingAs($user);

        $this
            ->getJson('/api/admin/messages')
            ->assertForbidden();

        $this
            ->patchJson(
                "/api/admin/messages/{$message->id}/read"
            )
            ->assertForbidden();

        $this
            ->deleteJson(
                "/api/admin/messages/{$message->id}"
            )
            ->assertForbidden();

        $this->assertDatabaseHas('contact_messages', [
            'id' => $message->id,
            'is_read' => false,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_admin_routes(): void
    {
        $this
            ->getJson('/api/admin/dashboard')
            ->assertUnauthorized();

        $this
            ->getJson('/api/admin/messages')
            ->assertUnauthorized();
    }
}
