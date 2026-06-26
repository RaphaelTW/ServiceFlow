<?php

declare(strict_types=1);

namespace App\Helpers;

final class Response
{
    public static function json(array $payload, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function ok(array $data = [], string $message = 'OK'): void
    {
        self::json(['message' => $message, 'data' => $data]);
    }

    public static function created(array $data = [], string $message = 'Criado com sucesso.'): void
    {
        self::json(['message' => $message, 'data' => $data], 201);
    }

    public static function noContent(): void
    {
        http_response_code(204);
        exit;
    }

    public static function error(string $message, int $status = 400, array $errors = []): void
    {
        self::json(['message' => $message, 'errors' => $errors], $status);
    }
}

