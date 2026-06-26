<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;

final class SubscriptionController
{
    public function index(): void
    {
        AuthMiddleware::user();
        Response::ok([
            ['id' => 'free', 'name' => 'Gratuito', 'price' => 0, 'customer_limit' => 30, 'work_order_limit' => 10],
            ['id' => 'pro', 'name' => 'Pro', 'price' => 39.90, 'customer_limit' => null, 'work_order_limit' => null],
            ['id' => 'business', 'name' => 'Empresa', 'price' => 79.90, 'customer_limit' => null, 'work_order_limit' => null],
        ]);
    }
}

