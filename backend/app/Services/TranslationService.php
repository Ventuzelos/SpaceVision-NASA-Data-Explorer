<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    public function translateToPortuguese(?string $text): ?string
    {
        if (blank($text)) {
            return $text;
        }

        $cacheKey = sprintf(
            'translation:pt:%s',
            hash('sha256', $text)
        );

        return Cache::remember(
            $cacheKey,
            now()->addDays(30),
            function () use ($text) {
                try {
                    $response = Http::timeout(30)
                        ->acceptJson()
                        ->post(
                            rtrim(
                                config('services.libretranslate.url'),
                                '/'
                            ) . '/translate',
                            [
                                'q' => $text,
                                'source' => 'en',
                                'target' => 'pt',
                                'format' => 'text',
                            ]
                        );

                    if ($response->failed()) {
                        Log::warning(
                            'LibreTranslate request failed.',
                            [
                                'status' => $response->status(),
                            ]
                        );

                        return $text;
                    }

                    return $response->json(
                        'translatedText',
                        $text
                    );
                } catch (\Throwable $exception) {
                    Log::warning(
                        'LibreTranslate request failed.',
                        [
                            'message' => $exception->getMessage(),
                        ]
                    );

                    return $text;
                }
            }
        );
    }
}
