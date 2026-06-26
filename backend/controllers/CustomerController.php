<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\CustomerRepository;
use App\Services\PlanLimitService;

final class CustomerController extends CrudController
{
    public function __construct()
    {
        $this->repository = new CustomerRepository();
    }

    protected function beforeCreate(int $tenantId): void
    {
        $this->assertPlan(fn (PlanLimitService $plans) => $plans->assertCanCreateCustomer($tenantId));
    }
}

