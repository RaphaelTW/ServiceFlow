<?php

declare(strict_types=1);

namespace App\Repositories;

final class CustomerRepository extends BaseRepository
{
    protected string $table = 'customers';

    public function countActive(int $tenantId): int
    {
        $stmt = $this->db->prepare('SELECT COUNT(*) FROM customers WHERE tenant_id = :tenant_id AND is_active = 1');
        $stmt->execute(['tenant_id' => $tenantId]);
        return (int) $stmt->fetchColumn();
    }
}
