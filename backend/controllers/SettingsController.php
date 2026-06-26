<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Request;
use App\Helpers\Response;
use App\Middleware\AuthMiddleware;

final class SettingsController
{
    public function show(): void
    {
        AuthMiddleware::user();
        Response::ok([
            'theme' => 'system',
            'dark_mode' => true,
            'language' => 'pt-BR',
            'backup' => 'daily',
            'integrations' => ['whatsapp_business' => false, 's3' => false],
        ]);
    }

    public function update(): void
    {
        AuthMiddleware::user();
        Response::ok(Request::json(), 'Configurações salvas.');
    }
}

