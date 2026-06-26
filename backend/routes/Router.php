<?php

declare(strict_types=1);

namespace App\Routes;

use App\Helpers\Response;

final class Router
{
    /** @var array<int, array{method:string,path:string,handler:callable}> */
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function post(string $path, callable $handler): void
    {
        $this->add('POST', $path, $handler);
    }

    public function put(string $path, callable $handler): void
    {
        $this->add('PUT', $path, $handler);
    }

    public function patch(string $path, callable $handler): void
    {
        $this->add('PATCH', $path, $handler);
    }

    public function delete(string $path, callable $handler): void
    {
        $this->add('DELETE', $path, $handler);
    }

    public function dispatch(string $method, string $path): void
    {
        foreach ($this->routes as $route) {
            $pattern = preg_replace('#\{[a-zA-Z_]+\}#', '([0-9]+)', $route['path']);
            if ($route['method'] === $method && preg_match('#^' . $pattern . '$#', $path, $matches)) {
                array_shift($matches);
                call_user_func_array($route['handler'], array_map('intval', $matches));
                return;
            }
        }

        Response::error('Rota não encontrada.', 404);
    }

    private function add(string $method, string $path, callable $handler): void
    {
        $this->routes[] = ['method' => $method, 'path' => $path, 'handler' => $handler];
    }
}

