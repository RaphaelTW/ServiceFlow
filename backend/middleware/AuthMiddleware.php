<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\Jwt;
use App\Helpers\Request;
use App\Helpers\Response;

final class AuthMiddleware
{
    public static function user(): array
    {
        $token = Request::bearerToken();
        $payload = $token ? Jwt::decode($token) : null;

        if (!$payload) {
            Response::error('Token inválido ou expirado.', 401);
        }

        return $payload;
    }
}

