<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\Response;

final class RateLimitMiddleware
{
    public static function handle(): void
    {
        $config = require __DIR__ . '/../config/app.php';
        $limit = $config['rate_limit'];
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'cli';
        $bucket = sys_get_temp_dir() . '/serviceflow_rate_' . md5($ip);
        $now = time();
        $hits = [];

        if (is_file($bucket)) {
            $hits = array_filter(array_map('intval', explode(',', (string) file_get_contents($bucket))), fn (int $hit) => $hit > $now - 60);
        }

        if (count($hits) >= $limit) {
            Response::error('Muitas requisições. Tente novamente em instantes.', 429);
        }

        $hits[] = $now;
        file_put_contents($bucket, implode(',', $hits));
    }
}

