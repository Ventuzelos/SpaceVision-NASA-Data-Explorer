<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function updateNasaApiKey(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nasa_api_key' => [
                'nullable',
                'string',
                'min:20',
                'max:255',
            ],
        ]);

        $user = $request->user();

        $nasaApiKey = isset($validated['nasa_api_key'])
            ? trim($validated['nasa_api_key'])
            : null;

        if (filled($nasaApiKey)) {
            $response = Http::timeout(10)
                ->acceptJson()
                ->get('https://api.nasa.gov/planetary/apod', [
                    'api_key' => $nasaApiKey,
                ]);

            if ($response->failed()) {
                throw ValidationException::withMessages([
                    'nasa_api_key' => [
                        'A chave da NASA não é válida ou não pôde ser confirmada.',
                    ],
                ]);
            }
        }

        $user->nasa_api_key = filled($nasaApiKey)
            ? $nasaApiKey
            : null;

        $user->save();

        return response()->json([
            'message' => filled($user->nasa_api_key)
                ? 'Chave da NASA guardada com sucesso.'
                : 'Chave da NASA removida com sucesso.',
            'has_nasa_api_key' => filled($user->nasa_api_key),
        ]);
    }
}
