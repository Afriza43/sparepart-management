<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SparepartController;

Route::get('/', function () {
    return view('welcome');
});
