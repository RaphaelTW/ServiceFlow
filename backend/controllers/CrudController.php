<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Request;
use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Repositories\BaseRepository;
use App\Services\PlanLimitService;
use RuntimeException;

abstract class CrudController
{
    protected BaseRepository $repository;

    public function index(): void
    {
        $user = AuthMiddleware::user();
        $query = Request::query();
        $page = max(1, (int) ($query['page'] ?? 1));
        $perPage = min(100, max(1, (int) ($query['per_page'] ?? 15)));
        Response::ok($this->repository->paginate((int) $user['tenant_id'], $query, $page, $perPage));
    }

    public function show(int $id): void
    {
        $user = AuthMiddleware::user();
        $row = $this->repository->find((int) $user['tenant_id'], $id);
        $row ? Response::ok($row) : Response::error('Registro não encontrado.', 404);
    }

    public function store(): void
    {
        $user = AuthMiddleware::user();
        $data = $this->payload(Request::json(), (int) $user['tenant_id']);
        $this->beforeCreate((int) $user['tenant_id']);
        Response::created($this->repository->create($data));
    }

    public function update(int $id): void
    {
        $user = AuthMiddleware::user();
        $data = $this->payload(Request::json(), (int) $user['tenant_id'], false);
        Response::ok($this->repository->update((int) $user['tenant_id'], $id, $data) ?? []);
    }

    public function patch(int $id): void
    {
        $this->update($id);
    }

    public function destroy(int $id): void
    {
        $user = AuthMiddleware::user();
        $this->repository->delete((int) $user['tenant_id'], $id);
        Response::noContent();
    }

    protected function payload(array $data, int $tenantId, bool $creating = true): array
    {
        unset($data['id'], $data['deleted_at'], $data['created_at'], $data['updated_at']);
        if ($creating) {
            $data['tenant_id'] = $tenantId;
        }

        return $data;
    }

    protected function beforeCreate(int $tenantId): void
    {
    }

    protected function assertPlan(callable $callback): void
    {
        try {
            $callback(new PlanLimitService());
        } catch (RuntimeException $exception) {
            Response::error($exception->getMessage(), 403);
        }
    }
}

