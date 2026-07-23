<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Favorite;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{

    public function usersCount(): JsonResponse
    {
        return response()->json([
            'count' => User::count(),
        ]);
    }


    public function usersStats(): JsonResponse
    {
        return response()->json([
            'total' => User::count(),
            'new_last_month' => User::query()
                ->where('created_at', '>=', now()->subMonth())
                ->count(),
        ]);
    }


    public function favoritesStats(): JsonResponse
    {
        $categories = [
            'apod',
            'donki',
            'epic',
            'neows',
        ];

        $countsByType = Favorite::query()
            ->selectRaw('nasa_type, COUNT(*) as total')
            ->groupBy('nasa_type')
            ->pluck('total', 'nasa_type');

        $byCategory = collect($categories)
            ->mapWithKeys(
                fn (string $category): array => [
                    $category => (int) (
                        $countsByType[$category] ?? 0
                    ),
                ]
            )
            ->toArray();

        $topSaved = Favorite::query()
            ->selectRaw(
                'nasa_type, nasa_id, MAX(title) as title, COUNT(*) as saves'
            )
            ->groupBy('nasa_type', 'nasa_id')
            ->orderByDesc('saves')
            ->limit(5)
            ->get()
            ->map(
                fn ($row): array => [
                    'nasa_type' => $row->nasa_type,
                    'nasa_id' => $row->nasa_id,
                    'title' => $row->title,
                    'saves' => (int) $row->saves,
                ]
            );

        return response()->json([
            'total' => Favorite::count(),
            'by_category' => $byCategory,
            'top_saved' => $topSaved,
        ]);
    }


    public function contactMessages(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],
            'status' => [
                'sometimes',
                'string',
                Rule::in([
                    'all',
                    'read',
                    'unread',
                ]),
            ],
            'per_page' => [
                'sometimes',
                'integer',
                'min:5',
                'max:50',
            ],
            'page' => [
                'sometimes',
                'integer',
                'min:1',
            ],
        ]);

        $search = trim($validated['search'] ?? '');
        $status = $validated['status'] ?? 'all';
        $perPage = (int) ($validated['per_page'] ?? 10);

        $query = ContactMessage::query()
            ->when(
                $search !== '',
                function ($query) use ($search): void {
                    $query->where(
                        function ($subQuery) use ($search): void {
                            $subQuery
                                ->where(
                                    'name',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'email',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'subject',
                                    'like',
                                    "%{$search}%"
                                )
                                ->orWhere(
                                    'message',
                                    'like',
                                    "%{$search}%"
                                );
                        }
                    );
                }
            )
            ->when(
                $status === 'read',
                fn ($query) => $query->where('is_read', true)
            )
            ->when(
                $status === 'unread',
                fn ($query) => $query->where('is_read', false)
            )
            ->latest();

        $paginatedMessages = $query
            ->paginate($perPage)
            ->withQueryString();

        return response()->json([
            'total' => ContactMessage::count(),
            'unread' => ContactMessage::query()
                ->where('is_read', false)
                ->count(),

            'filtered_total' => $paginatedMessages->total(),

            'messages' => $paginatedMessages->items(),

            'pagination' => [
                'current_page' => $paginatedMessages->currentPage(),
                'last_page' => $paginatedMessages->lastPage(),
                'per_page' => $paginatedMessages->perPage(),
                'from' => $paginatedMessages->firstItem(),
                'to' => $paginatedMessages->lastItem(),
                'total' => $paginatedMessages->total(),
            ],

            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }


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


    public function destroyContactMessage(
        ContactMessage $message
    ): JsonResponse {
        $message->delete();

        return response()->json([
            'message' => 'Mensagem eliminada com sucesso.',
        ]);
    }
}
