<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SparepartController;
use App\Http\Controllers\Api\MasterDataController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\SupplierController;



Route::prefix('v1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        // Fitur User
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', function (Request $request) {
            return $request->user();
        });

        Route::apiResource('spareparts', SparepartController::class);
        Route::get('master-data', [MasterDataController::class, 'index']);
        Route::delete('spareparts/{id}', [SparepartController::class, 'destroy']);
        Route::put('spareparts/{id}', [SparepartController::class, 'update']);

        Route::apiResource('transactions', TransactionController::class);
        Route::get('reports', [ReportController::class, 'index']);

        Route::get('dashboard', [DashboardController::class, 'index']);

        Route::apiResource('brands', BrandController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('vehicles', VehicleController::class);
        Route::apiResource('suppliers', SupplierController::class);
    });
});
