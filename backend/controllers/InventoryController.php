<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\InventoryRepository;

final class InventoryController extends CrudController
{
    public function __construct()
    {
        $this->repository = new InventoryRepository();
    }
}

