<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NasaApiService;
use App\Services\TranslationService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class NasaController extends Controller
{
    public function __construct(
        private readonly NasaApiService $nasaApiService,
        private readonly TranslationService $translationService
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

        $response = $this->getNasaResponse(
            'planetary/apod',
            $validated,
            $request
        );

        if ($response->getStatusCode() !== 200) {
            return $response;
        }

        $data = $response->getData(true);

        return response()->json(
            $this->translateApodData($data)
        );
    }

    public function epic(Request $request): JsonResponse
    {
        return $this->getNasaResponse(
            'EPIC/api/natural',
            [],
            $request,
            fn(array $data): array => $this->translateEpicData($data)
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
            $request,
            fn(array $data): array => $this->translateEpicData($data)
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
            $request,
            fn(array $data): array =>
            $this->translateNeoData($data)
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
            $request,
            fn(array $data): array => $this->translateDonkiData($data, $type)
        );
    }

    private function translateDonkiData(
        array $data,
        string $type
    ): array {
        if (! array_is_list($data)) {
            return $data;
        }

        return array_map(
            function ($item) use ($type): mixed {
                if (! is_array($item)) {
                    return $item;
                }

                return $this->translateDonkiItem(
                    $item,
                    $type
                );
            },
            $data
        );
    }

    private function translateDonkiItem(
        array $item,
        string $type
    ): array {
        if ($type === 'notifications') {
            $originalMessageBody =
                $item['messageBody'] ?? '';

            $item['original_message_body'] =
                $originalMessageBody;

            $item['translated_message_body'] =
                $this->translatePreservingUrls(
                    $originalMessageBody
                );

            return $item;
        }

        if (! in_array($type, ['FLR', 'CME'], true)) {
            return $item;
        }

        $originalNote = $item['note'] ?? '';

        $item['original_note'] = $originalNote;

        $item['translated_note'] =
            $this->translationService
            ->translateToPortuguese(
                $originalNote
            );

        if (
            $type === 'CME'
            && isset($item['cmeAnalyses'])
            && is_array($item['cmeAnalyses'])
        ) {
            $item['cmeAnalyses'] = array_map(
                function (array $analysis): array {
                    $originalAnalysisNote =
                        $analysis['note'] ?? '';

                    $analysis['original_note'] =
                        $originalAnalysisNote;

                    $analysis['translated_note'] =
                        $this->translationService
                        ->translateToPortuguese(
                            $originalAnalysisNote
                        );

                    return $analysis;
                },
                $item['cmeAnalyses']
            );
        }

        return $item;
    }

    private function translatePreservingUrls(
        string $text
    ): string {
        preg_match_all(
            '/https?:\/\/[^\s]+/',
            $text,
            $matches
        );

        $urls = array_values(
            array_unique($matches[0] ?? [])
        );

        $textWithoutUrls = preg_replace(
            '/https?:\/\/[^\s]+/',
            '',
            $text
        );

        if ($textWithoutUrls === null) {
            return $text;
        }

        $translatedText =
            $this->translationService
            ->translateToPortuguese(
                $textWithoutUrls
            );

        if ($urls === []) {
            return $translatedText;
        }

        return rtrim($translatedText)
            . "\n\nLinks originais da NASA:\n"
            . implode("\n", $urls);
    }

    private function translateNeoData(array $data): array
    {
        if (
            ! isset($data['near_earth_objects'])
            || ! is_array($data['near_earth_objects'])
        ) {
            return $data;
        }

        foreach (
            $data['near_earth_objects']
            as $date => $asteroids
        ) {
            if (! is_array($asteroids)) {
                continue;
            }

            $data['near_earth_objects'][$date] =
                array_map(
                    fn(array $asteroid): array =>
                    $this->translateNeoItem($asteroid),
                    $asteroids
                );
        }

        return $data;
    }

    private function translateNeoItem(array $asteroid): array
    {
        if (
            ! isset($asteroid['close_approach_data'])
            || ! is_array(
                $asteroid['close_approach_data']
            )
        ) {
            return $asteroid;
        }

        $asteroid['close_approach_data'] =
            array_map(
                function (array $approach): array {
                    $originalOrbitingBody =
                        $approach['orbiting_body']
                        ?? null;

                    $approach['original_orbiting_body'] = $originalOrbitingBody;

                    $approach['translated_orbiting_body'] =
                        $this->translationService
                        ->translateToPortuguese(
                            $originalOrbitingBody
                        );

                    return $approach;
                },
                $asteroid['close_approach_data']
            );

        return $asteroid;
    }

    private function translateEpicData(array $data): array
    {
        if (! array_is_list($data)) {
            return $data;
        }

        return array_map(
            fn(array $item): array => $this->translateEpicItem($item),
            $data
        );
    }

    private function translateEpicItem(array $item): array
    {
        $originalCaption =
            $item['caption'] ?? null;

        $item['original_caption'] =
            $originalCaption;

        $item['translated_caption'] =
            $this->translationService
            ->translateToPortuguese(
                $originalCaption
            );

        return $item;
    }

    private function translateApodData(array $data): array
    {
        if (array_is_list($data)) {
            return array_map(
                fn(array $item): array => $this->translateApodItem($item),
                $data
            );
        }

        return $this->translateApodItem($data);
    }

    private function translateApodItem(array $item): array
    {
        $originalTitle = $item['title'] ?? null;
        $originalExplanation = $item['explanation'] ?? null;

        $item['original_title'] = $originalTitle;
        $item['original_explanation'] = $originalExplanation;

        $item['translated_title'] =
            $this->translationService
            ->translateToPortuguese($originalTitle);

        $item['translated_explanation'] =
            $this->translationService
            ->translateToPortuguese($originalExplanation);

        return $item;
    }

    private function getNasaResponse(
        string $endpoint,
        array $query,
        Request $request,
        ?callable $transformer = null
    ): JsonResponse {
        try {
            $user = $request->user('sanctum');

            $data = $this->nasaApiService->get(
                $endpoint,
                $query,
                $user
            );

            if ($transformer !== null) {
                $data = $transformer($data);
            }

            return response()->json($data);
        } catch (RequestException $exception) {
            $response = $exception->response;

            if ($response->status() === 429) {
                $hasPersonalKey = filled(
                    $request->user('sanctum')?->nasa_api_key
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
