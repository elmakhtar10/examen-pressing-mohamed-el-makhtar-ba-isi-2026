<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Services\StatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatsController extends Controller
{

    public function __construct(
        protected StatsService $statsService
    ) {}

    public function dailyKpis(): JsonResponse
    {
        $data = $this->statsService->getDailyKpis();

        return response()->json([
            'message' => 'KPIs du jour récupérés avec succès.',
            'data'    => $data,
        ]);
    }

    public function monthlyTickets(Request $request): JsonResponse
    {
        $year = $request->query('year') ? (int) $request->query('year') : null;
        $data = $this->statsService->getMonthlyTickets($year);

        return response()->json([
            'message' => 'Nombre de tickets par mois récupéré avec succès.',
            'data'    => $data,
        ]);
    }

    public function revenueByService(Request $request): JsonResponse
    {
        $month = $request->query('month') ? (int) $request->query('month') : (int) date('m');
        $year  = $request->query('year')  ? (int) $request->query('year')  : (int) date('Y');

        $data = $this->statsService->getRevenueByService($month, $year);

        return response()->json([
            'message' => 'Répartition du chiffre d\'affaires par service récupérée avec succès.',
            'data'    => $data,
        ]);
    }
}
