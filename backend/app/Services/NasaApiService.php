<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class NasaApiService
{
    private readonly string $apiKey;
    private readonly string $baseUrl;
    private readonly int $cacheTtl;

    public function __construct()
    {
        $this->apiKey = (string) config('services.nasa.api_key');
        $this->baseUrl = rtrim(
            (string) config('services.nasa.base_url'),
            '/'
        );
        $this->cacheTtl = (int) config(
            'services.nasa.cache_ttl',
            3600
        );

        if ($this->apiKey === '') {
            throw new RuntimeException(
                'A chave da API da NASA não está configurada.'
            );
        }
    }

    public function get(string $endpoint, array $query = []): array
    {
        $endpoint = ltrim($endpoint, '/');

        // Garante que os mesmos parâmetros produzem sempre
        // a mesma chave de cache.
        ksort($query);

        $cacheKey = 'nasa:' . sha1(
            $endpoint . '|' . json_encode(
                $query,
                JSON_THROW_ON_ERROR
            )
        );

        return Cache::remember(
            $cacheKey,
            $this->cacheTtl,
            function () use ($endpoint, $query): array {
                $response = Http::baseUrl($this->baseUrl)
                    ->acceptJson()
                    ->timeout(15)
                    ->retry(2, 250)
                    ->get(
                        $endpoint,
                        array_merge($query, [
                            'api_key' => $this->apiKey,
                        ])
                    )
                    ->throw();

                $decoded = $response->json();

                if (!is_array($decoded)) {
                    throw new RuntimeException(
                        'A NASA devolveu uma resposta inválida.'
                    );
                }

                return $decoded;
            }
        );
    }
}
