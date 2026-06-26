<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\ServiceRepository;

final class ServiceController extends CrudController
{
    public function __construct()
    {
        $this->repository = new ServiceRepository();
    }
}

