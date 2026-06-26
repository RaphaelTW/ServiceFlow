<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Request;
use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Repositories\WorkOrderRepository;
use App\Services\PlanLimitService;

final class WorkOrderController extends CrudController
{
    private WorkOrderRepository $orders;

    public function __construct()
    {
        $this->orders = new WorkOrderRepository();
        $this->repository = $this->orders;
    }

    public function store(): void
    {
        $user = AuthMiddleware::user();
        $tenantId = (int) $user['tenant_id'];
        $this->assertPlan(fn (PlanLimitService $plans) => $plans->assertCanCreateWorkOrder($tenantId));

        $payload = Request::json();
        $services = $payload['services'] ?? [];
        unset($payload['services']);
        $order = $this->orders->create($this->payload($payload, $tenantId));

        foreach ($services as $service) {
            $this->orders->addService((int) $order['id'], (int) $service['id'], (int) ($service['quantity'] ?? 1), (float) ($service['unit_price'] ?? 0));
        }

        Response::created($order);
    }
}

