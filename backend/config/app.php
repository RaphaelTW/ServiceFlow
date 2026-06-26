<?php

declare(strict_types=1);

return [
    'env' => getenv('APP_ENV') ?: 'local',
    'url' => getenv('APP_URL') ?: 'http://localhost:8080',
    'frontend_url' => getenv('FRONTEND_URL') ?: 'http://localhost:5173',
    'jwt_secret' => getenv('JWT_SECRET') ?: 'dev-secret-change-me',
    'jwt_ttl' => (int) (getenv('JWT_TTL_SECONDS') ?: 86400),
    'rate_limit' => (int) (getenv('RATE_LIMIT_PER_MINUTE') ?: 120),
    'upload_max_mb' => (int) (getenv('UPLOAD_MAX_MB') ?: 10),
];

