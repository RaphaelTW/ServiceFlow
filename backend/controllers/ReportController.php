<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;

final class ReportController
{
    public function index(): void
    {
        AuthMiddleware::user();
        Response::ok([
            'available' => ['clientes', 'servicos', 'financeiro', 'produtos', 'ordens', 'ranking'],
            'formats' => ['pdf', 'excel'],
        ]);
    }
}

