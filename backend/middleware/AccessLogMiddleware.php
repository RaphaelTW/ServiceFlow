<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\Jwt;
use App\Helpers\Request;
use PDO;
use Throwable;

final class AccessLogMiddleware
{
    public static function handle(): void
    {
        try {
            $db = require __DIR__ . '/../config/database.php';
            $token = Request::bearerToken();
            $payload = $token ? Jwt::decode($token) : null;

            $stmt = $db->prepare(
                'INSERT INTO access_logs (tenant_id, user_id, method, path, ip_address, user_agent) VALUES (:tenant_id, :user_id, :method, :path, :ip_address, :user_agent)'
            );
            $stmt->execute([
                'tenant_id' => $payload['tenant_id'] ?? null,
                'user_id' => $payload['sub'] ?? null,
                'method' => $_SERVER['REQUEST_METHOD'] ?? 'GET',
                'path' => parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/',
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                'user_agent' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
            ]);
        } catch (Throwable) {
            // Logs nunca devem derrubar a requisição principal.
        }
    }
}

