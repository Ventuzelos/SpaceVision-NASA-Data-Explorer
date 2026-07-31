<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuizQuestion;
use Illuminate\Http\JsonResponse;

class QuizController extends Controller
{
    private const QUESTIONS_PER_ROUND = 8;

    public function index(): JsonResponse
    {
        $questions = QuizQuestion::query()
            ->inRandomOrder()
            ->limit(self::QUESTIONS_PER_ROUND)
            ->get([
                'id',
                'type',
                'text_pt',
                'text_en',
                'options_pt',
                'options_en',
                'correct_index',
                'fact_pt',
                'fact_en',
            ]);

        return response()->json([
            'questions' => $questions,
        ]);
    }
}
