<?php

declare(strict_types=1);

namespace App\Models;

abstract class Model
{
    public function __construct(protected array $attributes = [])
    {
    }

    public function toArray(): array
    {
        return $this->attributes;
    }
}

