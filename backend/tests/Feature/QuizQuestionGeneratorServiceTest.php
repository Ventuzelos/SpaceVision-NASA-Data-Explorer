<?php

namespace Tests\Feature;

use App\Services\QuizQuestionGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class QuizQuestionGeneratorServiceTest extends TestCase
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

    private function fakeGeminiResponse(array $items): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => json_encode($items)],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);
    }

    public function test_it_saves_only_well_formed_questions(): void
    {
        $this->fakeGeminiResponse([
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
            [
                // Malformed: correct_index out of bounds.
                'type' => 'Escolha múltipla',
                'text_pt' => 'Pergunta inválida?',
                'text_en' => 'Invalid question?',
                'options_pt' => ['A', 'B'],
                'options_en' => ['A', 'B'],
                'correct_index' => 5,
                'fact_pt' => 'Facto.',
                'fact_en' => 'Fact.',
            ],
            [
                // Malformed: missing fact_en.
                'type' => 'Verdadeiro ou Falso',
                'text_pt' => 'O Sol é uma estrela.',
                'text_en' => 'The Sun is a star.',
                'options_pt' => ['Verdadeiro', 'Falso'],
                'options_en' => ['True', 'False'],
                'correct_index' => 0,
                'fact_pt' => 'Facto.',
            ],
        ]);

        $saved = app(QuizQuestionGeneratorService::class)->generate(3);

        $this->assertSame(1, $saved);
        $this->assertDatabaseCount('quiz_questions', 1);
        $this->assertDatabaseHas('quiz_questions', [
            'text_pt' => 'Qual é o maior planeta?',
            'correct_index' => 1,
            'source' => 'ai',
        ]);
    }

    public function test_it_throws_when_api_key_is_missing(): void
    {
        config(['services.gemini.api_key' => '']);

        $this->expectException(RuntimeException::class);

        app(QuizQuestionGeneratorService::class)->generate(3);
    }

    public function test_it_throws_when_gemini_returns_invalid_json(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'not valid json'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $this->expectException(RuntimeException::class);

        app(QuizQuestionGeneratorService::class)->generate(3);
    }
}
