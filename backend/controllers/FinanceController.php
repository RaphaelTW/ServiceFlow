<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\FinanceRepository;

final class FinanceController extends CrudController
{
    public function __construct()
    {
        $this->repository = new FinanceRepository();
    }
}

