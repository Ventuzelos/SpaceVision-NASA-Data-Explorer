<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NasaApiService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class NasaController extends Controller
{
    public function __construct(
        private readonly NasaApiService $nasaApiService
    ) {}

    public function apod(Request $request): JsonResponse
    {
        $validator = validator(
            $request->all(),
            [
                'date' => [
                    'sometimes',
                    'date_format:Y-m-d',
                ],
                'start_date' => [
                    'sometimes',
                    'required_with:end_date',
                    'date_format:Y-m-d',
                ],
                'end_date' => [
                    'sometimes',
                    'required_with:start_date',
                    'date_format:Y-m-d',
                    'after_or_equal:start_date',
                ],
            ]
        );

        $validator->after(
            function ($validator) use ($request): void {
                $hasDate = $request->filled('date');

                $hasDateRange =
                    $request->filled('start_date')
                    || $request->filled('end_date');

                if ($hasDate && $hasDateRange) {
                    $validator->errors()->add(
                        'date',
                        'Não é possível usar date juntamente com start_date ou end_date.'
                    );
                }
            }
        );

        $validated = $validator->validate();

        return $this->getNasaResponse(
            'planetary/apod',
            $validated,
            $request
        );
    }

    public function epic(Request $request): JsonResponse
    {
        return $this->getNasaResponse(
            'EPIC/api/natural',
            [],
            $request
        );
    }

    public function epicByDate(
        Request $request,
        string $date
    ): JsonResponse {
        validator(
            ['date' => $date],
            ['date' => ['required', 'date_format:Y-m-d']]
        )->validate();

        return $this->getNasaResponse(
            "EPIC/api/natural/date/{$date}",
            [],
            $request
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
            $validated,
            $request
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

        if (! in_array($type, $allowedTypes, true)) {
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
            $validated,
            $request
        );
    }

    private function getNasaResponse(
        string $endpoint,
        array $query,
        Request $request
    ): JsonResponse {
        try {
            $data = $this->nasaApiService->get(
                $endpoint,
                $query,
                $request->user()
            );

            return response()->json($data);
        } catch (RequestException $exception) {
            $response = $exception->response;

            if ($response->status() === 429) {
                $hasPersonalKey = filled(
                    $request->user()?->nasa_api_key
                );

                return response()->json([
                    'message' => $hasPersonalKey
                        ? 'A sua chave da NASA atingiu temporariamente o limite de pedidos.'
                        : 'O limite geral de pedidos à NASA foi atingido. Adicione uma chave pessoal no perfil ou tente novamente mais tarde.',
                    'code' => 'NASA_RATE_LIMIT_EXCEEDED',
                ], 429);
            }

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
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 502);
        }
    }
}
