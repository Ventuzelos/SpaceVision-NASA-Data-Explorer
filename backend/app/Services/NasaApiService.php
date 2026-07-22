<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class NasaApiService
{
    private readonly string $defaultApiKey;

    private readonly string $baseUrl;

    private readonly int $cacheTtl;

    public function __construct()
    {
        $this->defaultApiKey = (string) config(
            'services.nasa.api_key'
        );

        $this->baseUrl = rtrim(
            (string) config('services.nasa.base_url'),
            '/'
        );

        $this->cacheTtl = (int) config(
            'services.nasa.cache_ttl',
            3600
        );
    }

    public function get(
        string $endpoint,
        array $query = [],
        ?User $user = null
    ): array {
        $endpoint = ltrim($endpoint, '/');

        ksort($query);

        $cacheKey = 'nasa:'.sha1(
            $endpoint.'|'.json_encode(
                $query,
                JSON_THROW_ON_ERROR
            )
        );

        return Cache::remember(
            $cacheKey,
            $this->cacheTtl,
            function () use (
                $endpoint,
                $query,
                $user
            ): array {
                $apiKey = $this->resolveApiKey($user);

                $response = Http::baseUrl($this->baseUrl)
                    ->acceptJson()
                    ->timeout(15)
                    ->retry(2, 250)
                    ->get(
                        $endpoint,
                        array_merge($query, [
                            'api_key' => $apiKey,
                        ])
                    )
                    ->throw();

                $decoded = $response->json();

                if (! is_array($decoded)) {
                    throw new RuntimeException(
                        'A NASA devolveu uma resposta inválida.'
                    );
                }

                return $decoded;
            }
        );
    }

    private function resolveApiKey(?User $user = null): string
    {
        if ($user && filled($user->nasa_api_key)) {
            return $user->nasa_api_key;
        }

        if ($this->defaultApiKey === '') {
            throw new RuntimeException(
                'A chave da API da NASA não está configurada.'
            );
        }

        return $this->defaultApiKey;
    }
}
