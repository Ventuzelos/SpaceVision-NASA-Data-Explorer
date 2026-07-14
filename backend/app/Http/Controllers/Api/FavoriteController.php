<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->favorites()->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nasa_type' => ['required', 'string', 'max:100'],
            'nasa_id' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'image_url' => ['nullable', 'string'],
            'data' => ['nullable', 'array'],
        ]);

        $favorite = $request->user()->favorites()->firstOrCreate(
            [
                'nasa_type' => $validated['nasa_type'],
                'nasa_id' => $validated['nasa_id'] ?? null,
            ],
            $validated
        );

        return response()->json($favorite, 201);
    }

    public function destroy(Request $request, Favorite $favorite)
    {
        if ($favorite->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Não tens permissão para apagar este favorito.',
            ], 403);
        }

        $favorite->delete();

        return response()->json([
            'message' => 'Favorito removido com sucesso.',
        ]);
    }
}
