<?php

declare(strict_types=1);

namespace App\Repositories;

final class DashboardRepository extends BaseRepository
{
    protected string $table = 'customers';

    public function metrics(int $tenantId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM v_dashboard_metrics WHERE tenant_id = :tenant_id');
        $stmt->execute(['tenant_id' => $tenantId]);
        $metrics = $stmt->fetch() ?: [];

        $finance = $this->db->prepare(
            'SELECT DATE_FORMAT(due_date, "%Y-%m") AS period, SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) AS income, SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) AS expense FROM financial_transactions WHERE tenant_id = :tenant_id AND deleted_at IS NULL GROUP BY period ORDER BY period DESC LIMIT 12'
        );
        $finance->execute(['tenant_id' => $tenantId]);

        $services = $this->db->prepare(
            'SELECT s.name, COUNT(*) AS total FROM work_order_services wos JOIN services s ON s.id = wos.service_id JOIN work_orders wo ON wo.id = wos.work_order_id WHERE wo.tenant_id = :tenant_id GROUP BY s.id ORDER BY total DESC LIMIT 8'
        );
        $services->execute(['tenant_id' => $tenantId]);

        $agenda = $this->db->prepare(
            'SELECT id, title, scheduled_at, status FROM work_orders WHERE tenant_id = :tenant_id AND scheduled_at >= NOW() AND deleted_at IS NULL ORDER BY scheduled_at ASC LIMIT 6'
        );
        $agenda->execute(['tenant_id' => $tenantId]);

        return [
            'metrics' => $metrics,
            'financial_chart' => array_reverse($finance->fetchAll()),
            'services_chart' => $services->fetchAll(),
            'upcoming' => $agenda->fetchAll(),
        ];
    }
}

