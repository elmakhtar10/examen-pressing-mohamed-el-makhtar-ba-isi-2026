<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Service\ServiceController;
use App\Http\Controllers\Ticket\TicketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/admin/services', ServiceController::class);
    Route::put('/admin/archives', [ServiceController::class, 'archive']);
    Route::post('/commandes', [TicketController::class, 'store']);
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::get('/admin/tickets', [TicketController::class, 'adminIndex']);
    Route::get('/admin/tickets/{id}', [TicketController::class, 'adminShow']);
});
