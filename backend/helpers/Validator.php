<?php

declare(strict_types=1);

namespace App\Helpers;

final class Validator
{
    public static function require(array $data, array $fields): array
    {
        $errors = [];
        foreach ($fields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                $errors[$field][] = 'Campo obrigatório.';
            }
        }

        return $errors;
    }

    public static function email(?string $value): bool
    {
        return $value !== null && filter_var($value, FILTER_VALIDATE_EMAIL) !== false;
    }
}

