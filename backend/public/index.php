<?php

declare(strict_types=1);

use App\Helpers\Response;
use App\Helpers\Env;
use App\Middleware\AccessLogMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Middleware\SecurityMiddleware;
use App\Routes\Router;

require __DIR__ . '/../vendor/autoload.php';

Env::load(__DIR__ . '/../../.env');

set_exception_handler(function (Throwable $exception): void {
    error_log($exception->getMessage());
    Response::json([
        'message' => 'Erro interno do servidor.',
        'trace_id' => bin2hex(random_bytes(8)),
    ], 500);
});

SecurityMiddleware::handle();
RateLimitMiddleware::handle();
AccessLogMiddleware::handle();

$router = new Router();
require __DIR__ . '/../routes/api.php';

$router->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
