<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Repositories\DashboardRepository;

final class DashboardController
{
    public function __construct(private readonly DashboardRepository $dashboard = new DashboardRepository())
    {
    }

    public function index(): void
    {
        $user = AuthMiddleware::user();
        Response::ok($this->dashboard->metrics((int) $user['tenant_id']));
    }
}

