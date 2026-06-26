<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

abstract class BaseRepository
{
    protected PDO $db;
    protected string $table;

    public function __construct()
    {
        $this->db = require __DIR__ . '/../config/database.php';
    }

    public function paginate(int $tenantId, array $filters = [], int $page = 1, int $perPage = 15): array
    {
        $offset = max(0, ($page - 1) * $perPage);
        $where = ['tenant_id = :tenant_id'];
        $params = ['tenant_id' => $tenantId];

        if (($filters['active'] ?? 'all') !== 'all') {
            $where[] = 'is_active = :is_active';
            $params['is_active'] = (int) $filters['active'];
        }

        if (!empty($filters['search'])) {
            $where[] = '(name LIKE :search OR email LIKE :search OR phone LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        $sql = 'SELECT * FROM ' . $this->table . ' WHERE ' . implode(' AND ', $where) . ' ORDER BY id DESC LIMIT :limit OFFSET :offset';
        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function find(int $tenantId, int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM ' . $this->table . ' WHERE tenant_id = :tenant_id AND id = :id LIMIT 1');
        $stmt->execute(['tenant_id' => $tenantId, 'id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): array
    {
        $columns = array_keys($data);
        $fields = implode(', ', $columns);
        $placeholders = ':' . implode(', :', $columns);
        $stmt = $this->db->prepare('INSERT INTO ' . $this->table . " ({$fields}) VALUES ({$placeholders})");
        $stmt->execute($data);

        return $this->find((int) $data['tenant_id'], (int) $this->db->lastInsertId()) ?? [];
    }

    public function update(int $tenantId, int $id, array $data): ?array
    {
        $sets = [];
        foreach (array_keys($data) as $column) {
            $sets[] = "{$column} = :{$column}";
        }

        $data['tenant_id'] = $tenantId;
        $data['id'] = $id;

        $stmt = $this->db->prepare('UPDATE ' . $this->table . ' SET ' . implode(', ', $sets) . ' WHERE tenant_id = :tenant_id AND id = :id');
        $stmt->execute($data);

        return $this->find($tenantId, $id);
    }

    public function delete(int $tenantId, int $id): void
    {
        $stmt = $this->db->prepare('UPDATE ' . $this->table . ' SET is_active = 0 WHERE tenant_id = :tenant_id AND id = :id');
        $stmt->execute(['tenant_id' => $tenantId, 'id' => $id]);
    }

    public function activate(int $tenantId, int $id): ?array
    {
        return $this->update($tenantId, $id, ['is_active' => 1]);
    }

    public function deactivate(int $tenantId, int $id): ?array
    {
        return $this->update($tenantId, $id, ['is_active' => 0]);
    }
}
