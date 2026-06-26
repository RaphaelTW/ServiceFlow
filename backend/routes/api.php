<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\CustomerController;
use App\Controllers\DashboardController;
use App\Controllers\FinanceController;
use App\Controllers\InventoryController;
use App\Controllers\ReportController;
use App\Controllers\ServiceController;
use App\Controllers\SettingsController;
use App\Controllers\SubscriptionController;
use App\Controllers\WorkOrderController;

$base = '/api/v1';

$auth = new AuthController();
$router->post("$base/auth/register", [$auth, 'register']);
$router->post("$base/auth/login", [$auth, 'login']);
$router->post("$base/auth/forgot-password", [$auth, 'forgotPassword']);
$router->post("$base/auth/reset-password", [$auth, 'resetPassword']);
$router->post("$base/auth/logout-all", [$auth, 'logoutAll']);

$router->get("$base/dashboard", [new DashboardController(), 'index']);
$router->get("$base/reports", [new ReportController(), 'index']);
$router->get("$base/settings", [new SettingsController(), 'show']);
$router->put("$base/settings", [new SettingsController(), 'update']);
$router->get("$base/subscriptions", [new SubscriptionController(), 'index']);

$resources = [
    'customers' => new CustomerController(),
    'services' => new ServiceController(),
    'work-orders' => new WorkOrderController(),
    'finance' => new FinanceController(),
    'inventory' => new InventoryController(),
];

foreach ($resources as $name => $controller) {
    $router->get("$base/$name", [$controller, 'index']);
    $router->post("$base/$name", [$controller, 'store']);
    $router->get("$base/$name/{id}", [$controller, 'show']);
    $router->put("$base/$name/{id}", [$controller, 'update']);
    $router->patch("$base/$name/{id}", [$controller, 'patch']);
    $router->delete("$base/$name/{id}", [$controller, 'destroy']);
}

