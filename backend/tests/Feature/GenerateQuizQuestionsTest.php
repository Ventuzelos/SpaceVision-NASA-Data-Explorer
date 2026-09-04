<?php

namespace Tests\Feature;

use App\Models\QuizQuestion;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GenerateQuizQuestionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.gemini.api_key' => 'TEST_KEY',
            'services.gemini.base_url' => 'https://generativelanguage.googleapis.com/v1beta',
            'services.gemini.model' => 'gemini-flash-latest',
        ]);
    }

    private function fakeGeminiWithOneQuestion(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        [
                                            'type' => 'Escolha múltipla',
                                            'text_pt' => 'Qual é o maior planeta?',
                                            'text_en' => 'Which is the largest planet?',
                                            'options_pt' => ['Terra', 'Júpiter', 'Marte'],
                                            'options_en' => ['Earth', 'Jupiter', 'Mars'],
                                            'correct_index' => 1,
                                            'fact_pt' => 'Júpiter é enorme.',
                                            'fact_en' => 'Jupiter is huge.',
                                        ],
                                    ]),
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);
    }

    public function test_if_empty_skips_generation_when_pool_is_populated(): void
    {
        QuizQuestion::factory()->count(3)->create();

        $this->fakeGeminiWithOneQuestion();

        $this->artisan('quiz:generate-questions', ['--if-empty' => true])
            ->assertSuccessful();

        // O ponto da flag: no arranque do contentor não se gasta uma chamada
        // à Gemini nem se mexe na pool que já existe.
        Http::assertNothingSent();
        $this->assertDatabaseCount('quiz_questions', 3);
    }

    public function test_if_empty_generates_when_pool_is_empty(): void
    {
        $this->fakeGeminiWithOneQuestion();

        $this->artisan('quiz:generate-questions', ['--if-empty' => true])
            ->assertSuccessful();

        $this->assertDatabaseCount('quiz_questions', 1);
    }

    public function test_without_the_flag_it_generates_even_when_pool_is_populated(): void
    {
        QuizQuestion::factory()->count(3)->create();

        $this->fakeGeminiWithOneQuestion();

        $this->artisan('quiz:generate-questions')
            ->assertSuccessful();

        $this->assertDatabaseCount('quiz_questions', 4);
    }

    public function test_weekly_schedule_for_quiz_generation_is_registered(): void
    {
        $events = collect(app(Schedule::class)->events())
            ->filter(fn ($event) => str_contains($event->command ?? '', 'quiz:generate-questions'));

        $this->assertCount(1, $events, 'O agendamento semanal do quiz desapareceu.');
        $this->assertSame('0 3 * * 0', $events->first()->expression);
    }
}
