<?php

use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Service\ServiceController;
use App\Http\Controllers\Ticket\TicketController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/services', ServiceController::class);
    Route::put('/archives', [ServiceController::class, 'archive']);
    Route::get('/tickets', [TicketController::class, 'adminIndex']);
    Route::get('/tickets/{id}', [TicketController::class, 'adminShow']);
    Route::put('/tickets/{id}/cancel', [TicketController::class, 'cancel']);
    Route::put('/tickets/{id}/status', [TicketController::class, 'updateStatus']);
    Route::post('/tickets/{id}/pay', [TicketController::class, 'pay']);
    Route::get('/stats/daily', [StatsController::class, 'dailyKpis']);
    Route::get('/stats/monthly-tickets', [StatsController::class, 'monthlyTickets']);
    Route::get('/stats/revenue-by-service', [StatsController::class, 'revenueByService']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/commandes', [TicketController::class, 'store']);
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
});
