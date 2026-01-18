<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SparepartController;

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
