<?php

namespace Tests\Feature;

use App\Services\NasaApiService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NasaApiServiceTest extends TestCase
{
    public function test_it_caches_identical_nasa_requests(): void
    {
        config([
            'cache.default' => 'array',
            'services.nasa.api_key' => 'TEST_KEY',
            'services.nasa.base_url' => 'https://api.nasa.gov',
            'services.nasa.cache_ttl' => 3600,
        ]);

        Cache::flush();

        Http::fake([
            'https://api.nasa.gov/planetary/apod*' => Http::response([
                'date' => '2024-01-01',
                'title' => 'NGC 1232: A Grand Design Spiral Galaxy',
                'media_type' => 'image',
                'url' => 'https://example.com/apod.jpg',
            ], 200),
        ]);

        $service = app(NasaApiService::class);

        $firstResult = $service->get('planetary/apod', [
            'date' => '2024-01-01',
        ]);

        $secondResult = $service->get('planetary/apod', [
            'date' => '2024-01-01',
        ]);

        $this->assertSame(
            'NGC 1232: A Grand Design Spiral Galaxy',
            $firstResult['title']
        );

        $this->assertSame($firstResult, $secondResult);

        Http::assertSentCount(1);

        Http::assertSent(function (Request $request): bool {
            return str_starts_with(
                $request->url(),
                'https://api.nasa.gov/planetary/apod'
            )
                && $request['date'] === '2024-01-01'
                && $request['api_key'] === 'TEST_KEY';
        });
    }
}
