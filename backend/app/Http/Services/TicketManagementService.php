<?php

namespace App\Http\Services;

use App\Models\Service;
use App\Models\Ticket;
use Exception;
use Illuminate\Support\Facades\DB;

class TicketManagementService{

    public function createTicket(int $userId, array $servicesData){
        return DB::transaction(function () use ($userId, $servicesData){
            $totalAmount = 0;
            $itemsToAttach = [];

            foreach ($servicesData as $item){
                $service = Service::findOrFail($item['service_id']);
                if($service->disponibilite !== 'actif'){
                    throw new Exception("Le service '{$service->libelle}' n'est plus disponible.");
                }

                $sousTotal = $service->prixUnitaire * $item['quantite'];
                $totalAmount += $sousTotal;

                $itemsToAttach[$service->id] = [
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $service->prix_unitaire,
                ];
            }

            $ticket = Ticket::create([
                'user_id' => $userId,
                'code' => 'TICK-' . strtoupper(uniqid()),
                'statut' => 'reçu',
                'montant_total' => $totalAmount,
                'is_paid' => false,
            ]);

            $ticket->services()->attach($itemsToAttach);
            return $ticket->load('services');
        });
    }
}
