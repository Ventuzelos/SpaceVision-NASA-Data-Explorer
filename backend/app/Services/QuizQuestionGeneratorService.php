<?php

namespace App\Services;

use App\Models\QuizQuestion;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class QuizQuestionGeneratorService
{
    private const ALLOWED_TYPES = [
        'Escolha múltipla',
        'Verdadeiro ou Falso',
    ];

    private const MIN_OPTIONS = 2;

    private const MAX_OPTIONS = 4;

    public function generate(int $count = 15): int
    {
        $apiKey = (string) config('services.gemini.api_key');

        if ($apiKey === '') {
            throw new RuntimeException(
                'A chave da API Gemini não está configurada.'
            );
        }

        $baseUrl = rtrim(
            (string) config('services.gemini.base_url'),
            '/'
        );

        $model = (string) config('services.gemini.model');

        // A chave vai no header, nunca na query string: o Guzzle inclui a URL
        // completa nas mensagens de exceção, que acabam nos logs.
        $response = Http::withHeaders(['x-goog-api-key' => $apiKey])
            // Um lote de 15 perguntas bilingues demora bem mais que um pedido
            // normal; é um comando semanal, vale a pena esperar.
            ->timeout(180)
            ->retry(2, 500)
            ->post(
                "{$baseUrl}/models/{$model}:generateContent",
                [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $this->buildPrompt($count)],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'temperature' => 0.9,
                        'responseMimeType' => 'application/json',
                        'responseSchema' => $this->responseSchema(),
                    ],
                ]
            )
            ->throw();

        $rawText = $response->json(
            'candidates.0.content.parts.0.text'
        );

        if (! is_string($rawText) || trim($rawText) === '') {
            throw new RuntimeException(
                'A Gemini devolveu uma resposta vazia.'
            );
        }

        $decoded = json_decode($rawText, true);

        if (! is_array($decoded)) {
            throw new RuntimeException(
                'A Gemini devolveu um JSON inválido.'
            );
        }

        $saved = 0;

        foreach ($decoded as $item) {
            if (! $this->isValidQuestion($item)) {
                Log::warning(
                    'Discarded malformed AI quiz question.',
                    ['item' => $item]
                );

                continue;
            }

            QuizQuestion::create([
                'type' => $item['type'],
                'text_pt' => $item['text_pt'],
                'text_en' => $item['text_en'],
                'options_pt' => array_values($item['options_pt']),
                'options_en' => array_values($item['options_en']),
                'correct_index' => $item['correct_index'],
                'fact_pt' => $item['fact_pt'],
                'fact_en' => $item['fact_en'],
                'source' => 'ai',
            ]);

            $saved++;
        }

        return $saved;
    }

    private function isValidQuestion(mixed $item): bool
    {
        if (! is_array($item)) {
            return false;
        }

        $requiredFields = [
            'type', 'text_pt', 'text_en',
            'options_pt', 'options_en',
            'correct_index', 'fact_pt', 'fact_en',
        ];

        foreach ($requiredFields as $field) {
            if (! array_key_exists($field, $item)) {
                return false;
            }
        }

        if (
            ! is_string($item['type'])
            || ! in_array($item['type'], self::ALLOWED_TYPES, true)
        ) {
            return false;
        }

        foreach (['text_pt', 'text_en', 'fact_pt', 'fact_en'] as $field) {
            if (
                ! is_string($item[$field])
                || trim($item[$field]) === ''
            ) {
                return false;
            }
        }

        $optionsPt = $this->normalizeOptions($item['options_pt']);
        $optionsEn = $this->normalizeOptions($item['options_en']);

        if ($optionsPt === null || $optionsEn === null) {
            return false;
        }

        if (count($optionsPt) !== count($optionsEn)) {
            return false;
        }

        $optionCount = count($optionsPt);

        if (
            $optionCount < self::MIN_OPTIONS
            || $optionCount > self::MAX_OPTIONS
        ) {
            return false;
        }

        if (! is_int($item['correct_index'])) {
            return false;
        }

        return $item['correct_index'] >= 0
            && $item['correct_index'] < $optionCount;
    }

    private function normalizeOptions(mixed $options): ?array
    {
        if (! is_array($options)) {
            return null;
        }

        $options = array_values($options);

        foreach ($options as $option) {
            if (! is_string($option) || trim($option) === '') {
                return null;
            }
        }

        if (count(array_unique($options)) !== count($options)) {
            return null;
        }

        return $options;
    }

    private function buildPrompt(int $count): string
    {
        return <<<PROMPT
            Gera {$count} perguntas originais de escolha múltipla sobre astronomia, exploração espacial e o Sistema Solar, para um quiz educativo dentro de uma aplicação chamada SpaceVision (NASA Data Explorer).

            Regras:
            - Cada pergunta deve ter entre 2 e 4 opções, com exatamente uma correta.
            - O campo "type" tem de ser exatamente um destes valores: "Escolha múltipla", "Verdadeiro ou Falso".
            - Usa "Verdadeiro ou Falso" apenas com "options_pt": ["Verdadeiro", "Falso"] e "options_en": ["True", "False"], nessa ordem.
            - "correct_index" é o índice (a começar em 0) da opção correta, e tem de corresponder à mesma posição em "options_pt" e "options_en".
            - "options_pt", "text_pt" e "fact_pt" em português europeu; "options_en", "text_en" e "fact_en" em inglês. O conteúdo tem de ser exatamente o mesmo nas duas línguas, apenas traduzido.
            - "fact_pt"/"fact_en" é uma curiosidade curta (1-2 frases) relacionada com a resposta certa.
            - Não repitas perguntas óbvias de quizzes comuns; varia o nível de dificuldade.
            - Não incluas texto fora do JSON pedido.
            PROMPT;
    }

    private function responseSchema(): array
    {
        return [
            'type' => 'ARRAY',
            'items' => [
                'type' => 'OBJECT',
                'properties' => [
                    'type' => ['type' => 'STRING'],
                    'text_pt' => ['type' => 'STRING'],
                    'text_en' => ['type' => 'STRING'],
                    'options_pt' => [
                        'type' => 'ARRAY',
                        'items' => ['type' => 'STRING'],
                    ],
                    'options_en' => [
                        'type' => 'ARRAY',
                        'items' => ['type' => 'STRING'],
                    ],
                    'correct_index' => ['type' => 'INTEGER'],
                    'fact_pt' => ['type' => 'STRING'],
                    'fact_en' => ['type' => 'STRING'],
                ],
                'required' => [
                    'type', 'text_pt', 'text_en',
                    'options_pt', 'options_en',
                    'correct_index', 'fact_pt', 'fact_en',
                ],
            ],
        ];
    }
}
