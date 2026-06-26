<?php

declare(strict_types=1);

namespace App\Helpers;

final class Jwt
{
    public static function encode(array $payload): string
    {
        $config = require __DIR__ . '/../config/app.php';
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $payload['iat'] = time();
        $payload['exp'] = time() + $config['jwt_ttl'];

        $segments = [
            self::base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR)),
            self::base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR)),
        ];

        $signature = hash_hmac('sha256', implode('.', $segments), $config['jwt_secret'], true);
        $segments[] = self::base64UrlEncode($signature);

        return implode('.', $segments);
    }

    public static function decode(string $token): ?array
    {
        $config = require __DIR__ . '/../config/app.php';
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;
        $expected = self::base64UrlEncode(hash_hmac('sha256', "{$header}.{$payload}", $config['jwt_secret'], true));

        if (!hash_equals($expected, $signature)) {
            return null;
        }

        $decoded = json_decode(self::base64UrlDecode($payload), true);

        if (!is_array($decoded) || (($decoded['exp'] ?? 0) < time())) {
            return null;
        }

        return $decoded;
    }

    private static function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $value): string
    {
        return base64_decode(strtr($value, '-_', '+/')) ?: '';
    }
}

