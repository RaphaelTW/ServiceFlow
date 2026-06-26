<?php

declare(strict_types=1);

namespace App\Repositories;

final class TenantRepository extends BaseRepository
{
    protected string $table = 'tenants';

    public function createTenant(string $companyName, string $plan = 'free'): array
    {
        $stmt = $this->db->prepare('INSERT INTO tenants (company_name, plan, status) VALUES (:company_name, :plan, "active")');
        $stmt->execute(['company_name' => $companyName, 'plan' => $plan]);

        $stmt = $this->db->prepare('SELECT * FROM tenants WHERE id = :id');
        $stmt->execute(['id' => $this->db->lastInsertId()]);
        return $stmt->fetch() ?: [];
    }
}

