<?php

return [

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'nasa' => [
        'api_key' => env('NASA_API_KEY'),
        'base_url' => env('NASA_BASE_URL', 'https://api.nasa.gov'),
        'cache_ttl' => (int) env('NASA_CACHE_TTL', 3600),
    ],

    'libretranslate' => [
        'url' => env(
            'LIBRETRANSLATE_API_URL',
            'http://localhost:5000'
        ),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'base_url' => env(
            'GEMINI_BASE_URL',
            'https://generativelanguage.googleapis.com/v1beta'
        ),
        'model' => env('GEMINI_MODEL', 'gemini-flash-latest'),
    ],
];
