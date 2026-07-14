<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
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
