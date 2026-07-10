<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NasaController extends Controller
{
    private function nasa()
    {
        return Http::baseUrl(config('services.nasa.base_url'))
            ->withQueryParameters([
                'api_key' => config('services.nasa.key'),
            ]);
    }

   public function apod(Request $request)
{
    $validated = $request->validate([
        'date' => ['nullable', 'date'],
    ]);

    $response = $this->nasa()->get('/planetary/apod', $validated);

    return response()->json(
        $response->json(),
        $response->status()
    );
}
    public function epic()
    {
        $response = $this->nasa()->get('/EPIC/api/natural');

        return response()->json($response->json(), $response->status());
    }

    public function epicByDate(string $date)
    {
        $response = $this->nasa()->get("/EPIC/api/natural/date/{$date}");

        return response()->json($response->json(), $response->status());
    }

    public function neoFeed(Request $request)
    {
        $validated = $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $response = $this->nasa()->get('/neo/rest/v1/feed', $validated);

        return response()->json($response->json(), $response->status());
    }

    public function donki(Request $request, string $type)
    {
        $allowedTypes = ['FLR', 'CME', 'GST', 'SEP', 'HSS', 'notifications'];

        if (!in_array($type, $allowedTypes)) {
            return response()->json([
                'message' => 'Tipo DONKI inválido.',
            ], 400);
        }

        $validated = $request->validate([
            'startDate' => ['required', 'date'],
            'endDate' => ['required', 'date', 'after_or_equal:startDate'],
        ]);

        $response = $this->nasa()->get("/DONKI/{$type}", $validated);

        return response()->json($response->json(), $response->status());
    }
}
