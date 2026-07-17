<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * Devolve o número total de utilizadores registados.
     */
    public function usersCount(): JsonResponse
    {
        return response()->json([
            'count' => User::count(),
        ]);
    }

    /**
     * Total de utilizadores registados e novos utilizadores no último mês.
     */
    public function usersStats(): JsonResponse
    {
        return response()->json([
            'total' => User::count(),
            'new_last_month' => User::where('created_at', '>=', now()->subMonth())->count(),
        ]);
    }

    /**
     * Estatísticas de favoritos de TODA a plataforma (todos os utilizadores),
     * agrupadas por categoria da NASA, e os conteúdos mais guardados.
     */
    public function favoritesStats(): JsonResponse
    {
        $categories = ['apod', 'donki', 'epic', 'neows'];

        $countsByType = Favorite::query()
            ->selectRaw('nasa_type, COUNT(*) as total')
            ->groupBy('nasa_type')
            ->pluck('total', 'nasa_type');

        $byCategory = collect($categories)
            ->mapWithKeys(fn ($category) => [$category => (int) ($countsByType[$category] ?? 0)])
            ->toArray();

        $topSaved = Favorite::query()
            ->selectRaw('nasa_type, nasa_id, MAX(title) as title, COUNT(*) as saves')
            ->groupBy('nasa_type', 'nasa_id')
            ->orderByDesc('saves')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'nasa_type' => $row->nasa_type,
                'nasa_id' => $row->nasa_id,
                'title' => $row->title,
                'saves' => (int) $row->saves,
            ]);

        return response()->json([
            'total' => Favorite::count(),
            'by_category' => $byCategory,
            'top_saved' => $topSaved,
        ]);
    }

    /**
     * Lista todas as mensagens de contacto.
     */
    public function contactMessages(): JsonResponse
    {
        $messages = ContactMessage::latest()->get();

        return response()->json([
            'total' => ContactMessage::count(),
            'unread' => ContactMessage::where('is_read', false)->count(),
            'messages' => $messages,
        ]);
    }

    /**
     * Marca uma mensagem de contacto como lida.
     */
    public function markContactMessageAsRead(
        ContactMessage $message
    ): JsonResponse {
        if (! $message->is_read) {
            $message->update([
                'is_read' => true,
            ]);
        }

        return response()->json([
            'message' => 'Mensagem marcada como lida.',
            'data' => $message->fresh(),
        ]);
    }

    /**
     * Elimina uma mensagem de contacto.
     */
    public function destroyContactMessage(
        ContactMessage $message
    ): JsonResponse {
        $message->delete();

        return response()->json([
            'message' => 'Mensagem eliminada com sucesso.',
        ]);
    }
}
