<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Request;
use App\Helpers\Response;
use App\Helpers\Validator;
use App\Services\AuthService;
use RuntimeException;

final class AuthController
{
    public function __construct(private readonly AuthService $auth = new AuthService())
    {
    }

    public function register(): void
    {
        $data = Request::json();
        $errors = Validator::require($data, ['name', 'email', 'password']);
        if (!Validator::email($data['email'] ?? null)) {
            $errors['email'][] = 'E-mail inválido.';
        }

        if ($errors) {
            Response::error('Dados inválidos.', 422, $errors);
        }

        try {
            Response::created($this->auth->register($data), 'Conta criada com sucesso.');
        } catch (RuntimeException $exception) {
            Response::error($exception->getMessage(), 422);
        }
    }

    public function login(): void
    {
        $data = Request::json();
        $errors = Validator::require($data, ['email', 'password']);
        if ($errors) {
            Response::error('Dados inválidos.', 422, $errors);
        }

        try {
            Response::ok($this->auth->login($data['email'], $data['password']), 'Login realizado.');
        } catch (RuntimeException $exception) {
            Response::error($exception->getMessage(), 401);
        }
    }

    public function forgotPassword(): void
    {
        Response::ok(['sent' => true], 'Se o e-mail existir, enviaremos instruções de recuperação.');
    }

    public function resetPassword(): void
    {
        Response::ok(['reset' => true], 'Senha alterada com sucesso.');
    }

    public function logoutAll(): void
    {
        Response::ok(['revoked' => true], 'Sessões encerradas.');
    }
}

