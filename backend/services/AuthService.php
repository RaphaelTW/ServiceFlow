<?php

declare(strict_types=1);

namespace App\Services;

use App\Helpers\Jwt;
use App\Repositories\TenantRepository;
use App\Repositories\UserRepository;
use RuntimeException;

final class AuthService
{
    public function __construct(
        private readonly UserRepository $users = new UserRepository(),
        private readonly TenantRepository $tenants = new TenantRepository()
    ) {
    }

    public function register(array $data): array
    {
        if ($this->users->findByEmail($data['email'])) {
            throw new RuntimeException('E-mail já cadastrado.');
        }

        $tenant = $this->tenants->createTenant($data['company_name'] ?? $data['name']);
        $user = $this->users->createUser([
            'tenant_id' => $tenant['id'],
            'name' => $data['name'],
            'email' => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role' => 'owner',
            'email_verified_at' => date('Y-m-d H:i:s'),
        ]);

        return $this->sessionPayload($user);
    }

    public function login(string $email, string $password): array
    {
        $user = $this->users->findByEmail($email);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new RuntimeException('Credenciais inválidas.');
        }

        return $this->sessionPayload($user);
    }

    private function sessionPayload(array $user): array
    {
        $token = Jwt::encode([
            'sub' => (int) $user['id'],
            'tenant_id' => (int) $user['tenant_id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ]);

        return [
            'token' => $token,
            'user' => [
                'id' => (int) $user['id'],
                'tenant_id' => (int) $user['tenant_id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
            ],
        ];
    }
}

