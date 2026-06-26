<?php

declare(strict_types=1);

namespace App\Repositories;

final class UserRepository extends BaseRepository
{
    protected string $table = 'users';

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();
        return $user ?: null;
    }

    public function createUser(array $data): array
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (tenant_id, name, email, password_hash, role, email_verified_at) VALUES (:tenant_id, :name, :email, :password_hash, :role, :email_verified_at)'
        );
        $stmt->execute($data);

        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $this->db->lastInsertId()]);
        return $stmt->fetch() ?: [];
    }
}

