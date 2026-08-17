<?php

namespace App\Http\Services;

use App\Models\Paiement;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatsService{

    /**
     * @return array
     * Obtenir les indicateurs clés (KPI) du jour même
     */
    public function getDailyKpis(){
        $today = Carbon::today();

        $ticketsCreatedToday = Ticket::whereDate('created_at', $today)->count();

        $ticketsRetrievedToday = Ticket::where('statut', 'recupere')
            ->whereDate('updated_at', $today)
            ->count();

        $dailyRevenue = Paiement::whereDate('date_paiement', $today)
            ->sum('montant');

        return [
            'tickets_created_today'   => $ticketsCreatedToday,
            'tickets_retrieved_today' => $ticketsRetrievedToday,
            'daily_revenue'           => (float) $dailyRevenue,
        ];
    }

    /**
     * Nombre de tickets créés par mois sur une année donnée (par défaut l'année en cours)
     */
    public function getMonthlyTickets(?int $year = null): array
    {
        $year = $year ?? Carbon::now()->year;

        $ticketsPerMonth = Ticket::select(
            DB::raw('EXTRACT(MONTH FROM created_at)::integer as month'),
            DB::raw('COUNT(*)::integer as total')
        )
            ->whereYear('created_at', $year)
            ->groupBy(DB::raw('EXTRACT(MONTH FROM created_at)'))
            ->pluck('total', 'month')
            ->toArray();

        // Remplir les 12 mois de l'année
        $formattedData = [];
        for ($m = 1; $m <= 12; $m++) {
            $formattedData[] = [
                'month' => $m,
                'total' => $ticketsPerMonth[$m] ?? 0,
            ];
        }

        return [
            'year' => $year,
            'data' => $formattedData,
        ];
    }

    /**
     * Répartition du chiffre d'affaires par service pour un mois et une année donnés
     */
    public function getRevenueByService(int $month, int $year): array
    {
        $revenue = DB::table('ticket_service')
        ->join('tickets', 'tickets.id', '=', 'ticket_service.ticket_id')
            ->join('services', 'services.id', '=', 'ticket_service.service_id')
            ->select(
                'services.id as service_id',
                'services.libelle as service_libelle',
                DB::raw('SUM(ticket_service.quantite * ticket_service.prix_unitaire) as total_revenue'),
                DB::raw('SUM(ticket_service.quantite) as total_quantity')
            )
            ->whereYear('tickets.created_at', $year)
            ->whereMonth('tickets.created_at', $month)
            ->groupBy('services.id', 'services.libelle')
            ->orderByDesc(DB::raw('SUM(ticket_service.quantite * ticket_service.prix_unitaire)'))
            ->get();

        return [
            'month' => $month,
            'year'  => $year,
            'data'  => $revenue->map(fn($item) => [
                'service_id'     => (int) $item->service_id,
                'service_libelle'    => $item->service_libelle,
                'total_revenue'  => (float) $item->total_revenue,
                'total_quantity' => (int) $item->total_quantity,
            ]),
        ];
    }

}
