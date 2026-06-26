<?php

declare(strict_types=1);

namespace App\Repositories;

final class WorkOrderRepository extends BaseRepository
{
    protected string $table = 'work_orders';

    public function addService(int $workOrderId, int $serviceId, int $quantity, float $unitPrice): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO work_order_services (work_order_id, service_id, quantity, unit_price, total) VALUES (:work_order_id, :service_id, :quantity, :unit_price, :total)'
        );
        $stmt->execute([
            'work_order_id' => $workOrderId,
            'service_id' => $serviceId,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total' => $quantity * $unitPrice,
        ]);
    }

    public function monthlyCount(int $tenantId): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM work_orders WHERE tenant_id = :tenant_id AND is_active = 1 AND created_at >= DATE_FORMAT(CURRENT_DATE, "%Y-%m-01")'
        );
        $stmt->execute(['tenant_id' => $tenantId]);
        return (int) $stmt->fetchColumn();
    }
}
