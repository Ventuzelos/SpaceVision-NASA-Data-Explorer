<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Restringe explicitamente quais origens podem chamar a API. Sem este
    | ficheiro, o Laravel recorre ao default da framework (allowed_origins
    | => ['*']), o que permite a qualquer site fazer pedidos não
    | autenticados à API (ver finding F3 da auditoria de segurança).
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter(explode(',', env(
        'CORS_ALLOWED_ORIGINS',
        env('FRONTEND_URL', 'http://localhost:5173')
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
