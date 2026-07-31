<?php

namespace Database\Factories;

use App\Models\QuizQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuizQuestion>
 */
class QuizQuestionFactory extends Factory
{
    protected $model = QuizQuestion::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'Escolha múltipla',
            'text_pt' => fake()->sentence().'?',
            'text_en' => fake()->sentence().'?',
            'options_pt' => ['Opção A', 'Opção B', 'Opção C'],
            'options_en' => ['Option A', 'Option B', 'Option C'],
            'correct_index' => 0,
            'fact_pt' => fake()->sentence(),
            'fact_en' => fake()->sentence(),
            'source' => 'ai',
        ];
    }
}
