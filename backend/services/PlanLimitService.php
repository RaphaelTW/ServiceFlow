<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\CustomerRepository;
use App\Repositories\WorkOrderRepository;
use PDO;
use RuntimeException;

final class PlanLimitService
{
    private PDO $db;

    public function __construct(
        private readonly CustomerRepository $customers = new CustomerRepository(),
        private readonly WorkOrderRepository $orders = new WorkOrderRepository()
    ) {
        $this->db = require __DIR__ . '/../config/database.php';
    }

    public function assertCanCreateCustomer(int $tenantId): void
    {
        if ($this->plan($tenantId) === 'free' && $this->customers->countActive($tenantId) >= 30) {
            throw new RuntimeException('Limite do plano gratuito atingido: 30 clientes.');
        }
    }

    public function assertCanCreateWorkOrder(int $tenantId): void
    {
        if ($this->plan($tenantId) === 'free' && $this->orders->monthlyCount($tenantId) >= 10) {
            throw new RuntimeException('Limite do plano gratuito atingido: 10 ordens de serviço por mês.');
        }
    }

    private function plan(int $tenantId): string
    {
        $stmt = $this->db->prepare('SELECT plan FROM tenants WHERE id = :id');
        $stmt->execute(['id' => $tenantId]);
        return (string) ($stmt->fetchColumn() ?: 'free');
    }
}

