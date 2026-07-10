<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NasaApiService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NasaController extends Controller
{
    public function __construct(
        private readonly NasaApiService $nasaApiService
    ) {
    }

    public function apod(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['sometimes', 'date_format:Y-m-d'],
        ]);

        return $this->getNasaResponse(
            'planetary/apod',
            $validated
        );
    }

    public function epic(): JsonResponse
    {
        return $this->getNasaResponse(
            'EPIC/api/natural'
        );
    }

    public function epicByDate(string $date): JsonResponse
    {
        validator(
            ['date' => $date],
            ['date' => ['required', 'date_format:Y-m-d']]
        )->validate();

        return $this->getNasaResponse(
            "EPIC/api/natural/date/{$date}"
        );
    }

    public function neoFeed(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'start_date' => [
                'required',
                'date_format:Y-m-d',
            ],
            'end_date' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
            ],
        ]);

        return $this->getNasaResponse(
            'neo/rest/v1/feed',
            $validated
        );
    }

    public function donki(
        Request $request,
        string $type
    ): JsonResponse {
        $allowedTypes = [
            'FLR',
            'CME',
            'GST',
            'SEP',
            'HSS',
            'notifications',
        ];

        if (!in_array($type, $allowedTypes, true)) {
            return response()->json([
                'message' => 'Tipo DONKI inválido.',
            ], 400);
        }

        $validated = $request->validate([
            'startDate' => [
                'required',
                'date_format:Y-m-d',
            ],
            'endDate' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:startDate',
            ],
        ]);

        return $this->getNasaResponse(
            "DONKI/{$type}",
            $validated
        );
    }

    private function getNasaResponse(
        string $endpoint,
        array $query = []
    ): JsonResponse {
        try {
            $data = $this->nasaApiService->get(
                $endpoint,
                $query
            );

            return response()->json($data);
        } catch (RequestException $exception) {
            $response = $exception->response;

            return response()->json(
                $response->json() ?? [
                    'message' => 'A NASA devolveu uma resposta inválida.',
                ],
                $response->status()
            );
        } catch (ConnectionException) {
            return response()->json([
                'message' => 'Não foi possível estabelecer ligação à NASA.',
            ], 503);
        }
    }
}
