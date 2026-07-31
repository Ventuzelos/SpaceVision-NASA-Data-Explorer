<?php

namespace Tests\Feature;

use App\Models\QuizQuestion;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_questions_endpoint_returns_up_to_eight_questions(): void
    {
        QuizQuestion::factory()->count(10)->create();

        $response = $this->getJson('/api/quiz/questions');

        $response->assertOk();

        $this->assertCount(
            8,
            $response->json('questions')
        );

        $response->assertJsonStructure([
            'questions' => [
                '*' => [
                    'id',
                    'type',
                    'text_pt',
                    'text_en',
                    'options_pt',
                    'options_en',
                    'correct_index',
                    'fact_pt',
                    'fact_en',
                ],
            ],
        ]);
    }

    public function test_questions_endpoint_returns_fewer_than_eight_if_pool_is_small(): void
    {
        QuizQuestion::factory()->count(3)->create();

        $response = $this->getJson('/api/quiz/questions');

        $response->assertOk();

        $this->assertCount(
            3,
            $response->json('questions')
        );
    }
}
