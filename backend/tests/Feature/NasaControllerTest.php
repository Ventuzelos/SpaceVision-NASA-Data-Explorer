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

    public function test_epic_endpoint_returns_nasa_data(): void
{
    Http::fake([
        'https://api.nasa.gov/EPIC/api/natural*' => Http::response([
            [
                'identifier' => '20260715000000',
                'caption' => 'Earth from EPIC',
                'image' => 'epic_1b_20260715000000',
                'date' => '2026-07-15 00:00:00',
            ],
        ], 200),
    ]);

    $response = $this->getJson('/api/nasa/epic');

    $response
        ->assertOk()
        ->assertJsonPath('0.caption', 'Earth from EPIC')
        ->assertJsonPath(
            '0.image',
            'epic_1b_20260715000000'
        );

    Http::assertSentCount(1);

    Http::assertSent(function (Request $request): bool {
        return str_starts_with(
            $request->url(),
            'https://api.nasa.gov/EPIC/api/natural'
        )
            && $request['api_key'] === 'TEST_KEY';
    });
}

public function test_epic_by_date_endpoint_returns_nasa_data(): void
{
    Http::fake([
        'https://api.nasa.gov/EPIC/api/natural/date/2026-07-15*'
            => Http::response([
                [
                    'identifier' => '20260715000000',
                    'caption' => 'Earth on selected date',
                    'image' => 'epic_selected_date',
                    'date' => '2026-07-15 00:00:00',
                ],
            ], 200),
    ]);

    $response = $this->getJson(
        '/api/nasa/epic/2026-07-15'
    );

    $response
        ->assertOk()
        ->assertJsonPath(
            '0.caption',
            'Earth on selected date'
        );

    Http::assertSent(function (Request $request): bool {
        return str_starts_with(
            $request->url(),
            'https://api.nasa.gov/EPIC/api/natural/date/2026-07-15'
        )
            && $request['api_key'] === 'TEST_KEY';
    });
}

public function test_epic_by_date_rejects_invalid_date(): void
{
    Http::fake();

    $response = $this->getJson(
        '/api/nasa/epic/15-07-2026'
    );

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors('date');

    Http::assertNothingSent();
}

public function test_neo_feed_endpoint_returns_nasa_data(): void
{
    Http::fake([
        'https://api.nasa.gov/neo/rest/v1/feed*'
            => Http::response([
                'element_count' => 1,
                'near_earth_objects' => [
                    '2026-07-15' => [
                        [
                            'id' => '123456',
                            'name' => 'Test Asteroid',
                            'is_potentially_hazardous_asteroid' => false,
                        ],
                    ],
                ],
            ], 200),
    ]);

    $response = $this->getJson(
        '/api/nasa/neo/feed'
        . '?start_date=2026-07-15'
        . '&end_date=2026-07-16'
    );

    $response
        ->assertOk()
        ->assertJsonPath('element_count', 1)
        ->assertJsonPath(
            'near_earth_objects.2026-07-15.0.name',
            'Test Asteroid'
        );

    Http::assertSent(function (Request $request): bool {
        return str_starts_with(
            $request->url(),
            'https://api.nasa.gov/neo/rest/v1/feed'
        )
            && $request['start_date'] === '2026-07-15'
            && $request['end_date'] === '2026-07-16'
            && $request['api_key'] === 'TEST_KEY';
    });
}

public function test_neo_feed_requires_dates(): void
{
    Http::fake();

    $response = $this->getJson('/api/nasa/neo/feed');

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'start_date',
            'end_date',
        ]);

    Http::assertNothingSent();
}

public function test_neo_feed_rejects_end_date_before_start_date(): void
{
    Http::fake();

    $response = $this->getJson(
        '/api/nasa/neo/feed'
        . '?start_date=2026-07-16'
        . '&end_date=2026-07-15'
    );

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors('end_date');

    Http::assertNothingSent();
}

public function test_donki_endpoint_returns_nasa_data(): void
{
    Http::fake([
        'https://api.nasa.gov/DONKI/CME*'
            => Http::response([
                [
                    'activityID' => '2026-07-15T10:00:00-CME-001',
                    'startTime' => '2026-07-15T10:00Z',
                    'sourceLocation' => 'S10E20',
                ],
            ], 200),
    ]);

    $response = $this->getJson(
        '/api/nasa/donki/CME'
        . '?startDate=2026-07-15'
        . '&endDate=2026-07-16'
    );

    $response
        ->assertOk()
        ->assertJsonPath(
            '0.activityID',
            '2026-07-15T10:00:00-CME-001'
        )
        ->assertJsonPath(
            '0.sourceLocation',
            'S10E20'
        );

    Http::assertSent(function (Request $request): bool {
        return str_starts_with(
            $request->url(),
            'https://api.nasa.gov/DONKI/CME'
        )
            && $request['startDate'] === '2026-07-15'
            && $request['endDate'] === '2026-07-16'
            && $request['api_key'] === 'TEST_KEY';
    });
}

public function test_donki_requires_dates(): void
{
    Http::fake();

    $response = $this->getJson(
        '/api/nasa/donki/FLR'
    );

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors([
            'startDate',
            'endDate',
        ]);

    Http::assertNothingSent();
}

public function test_donki_rejects_end_date_before_start_date(): void
{
    Http::fake();

    $response = $this->getJson(
        '/api/nasa/donki/GST'
        . '?startDate=2026-07-16'
        . '&endDate=2026-07-15'
    );

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors('endDate');

    Http::assertNothingSent();
}

public function test_nasa_connection_error_returns_service_unavailable(): void
{
    Http::fake(function () {
        throw new \Illuminate\Http\Client\ConnectionException(
            'Connection failed'
        );
    });

    $response = $this->getJson(
        '/api/nasa/apod?date=2026-07-15'
    );

    $response
        ->assertStatus(503)
        ->assertJson([
            'message' =>
                'Não foi possível estabelecer ligação à NASA.',
        ]);
}
}
