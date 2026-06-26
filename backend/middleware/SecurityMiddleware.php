<?php

declare(strict_types=1);

namespace App\Middleware;

final class SecurityMiddleware
{
    public static function handle(): void
    {
        $config = require __DIR__ . '/../config/app.php';
        $origin = $_SERVER['HTTP_ORIGIN'] ?? $config['frontend_url'];
        $allowedOrigins = [
            $config['frontend_url'],
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ];

        $isLocalNetworkOrigin = is_string($origin)
            && preg_match('#^http://(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+):5173$#', $origin);
        $allowedOrigin = in_array($origin, $allowedOrigins, true) || $isLocalNetworkOrigin ? $origin : $config['frontend_url'];

        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
        header("Access-Control-Allow-Origin: {$allowedOrigin}");
        header('Vary: Origin');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
