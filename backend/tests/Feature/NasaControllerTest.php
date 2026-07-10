<?php

namespace Tests\Feature;

use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NasaControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'cache.default' => 'array',
            'services.nasa.api_key' => 'TEST_KEY',
            'services.nasa.base_url' => 'https://api.nasa.gov',
            'services.nasa.cache_ttl' => 3600,
        ]);

        Cache::flush();
    }

    public function test_apod_endpoint_returns_cached_nasa_data(): void
    {
        Http::fake([
            'https://api.nasa.gov/planetary/apod*' => Http::response([
                'date' => '2024-01-01',
                'title' => 'NGC 1232: A Grand Design Spiral Galaxy',
                'media_type' => 'image',
                'url' => 'https://example.com/apod.jpg',
            ], 200),
        ]);

        $firstResponse = $this->getJson(
            '/api/nasa/apod?date=2024-01-01'
        );

        $secondResponse = $this->getJson(
            '/api/nasa/apod?date=2024-01-01'
        );

        $firstResponse
            ->assertOk()
            ->assertJsonPath(
                'title',
                'NGC 1232: A Grand Design Spiral Galaxy'
            );

        $secondResponse
            ->assertOk()
            ->assertJsonPath(
                'title',
                'NGC 1232: A Grand Design Spiral Galaxy'
            );

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

    public function test_apod_endpoint_rejects_invalid_date(): void
    {
        Http::fake();

        $response = $this->getJson(
            '/api/nasa/apod?date=01-01-2024'
        );

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('date');

        Http::assertNothingSent();
    }

    public function test_donki_endpoint_rejects_invalid_type(): void
    {
        Http::fake();

        $response = $this->getJson(
            '/api/nasa/donki/INVALID'
            . '?startDate=2024-01-01'
            . '&endDate=2024-01-02'
        );

        $response
            ->assertStatus(400)
            ->assertJson([
                'message' => 'Tipo DONKI inválido.',
            ]);

        Http::assertNothingSent();
    }
}
