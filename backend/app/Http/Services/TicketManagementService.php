<?php

namespace App\Http\Services;

use App\Mail\NewOrderNotificationMail;
use App\Mail\TicketCreatedMail;
use App\Models\Service;
use App\Models\Ticket;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TicketManagementService{

    public function createTicket(int $userId, array $servicesData): Ticket
    {
        $ticket = DB::transaction(function () use ($userId, $servicesData) {
            $totalAmount = 0;
            $itemsToAttach = [];

            foreach ($servicesData as $item) {
                $service = Service::findOrFail($item['service_id']);

                if ($service->disponibilite !== 'actif') {
                    throw new Exception("Le service '{$service->libelle}' n'est plus disponible.");
                }

                $sousTotal = $service->prix_unitaire * $item['quantite'];
                $totalAmount += $sousTotal;

                $itemsToAttach[$service->id] = [
                    'quantite'      => $item['quantite'],
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

            return $ticket->load(['user', 'services']);
        });
        /**
         * Confirmation pour le client
         */
        try{
            if ($ticket->user && $ticket->user->email) {
                Mail::to($ticket->user->email)->send(new TicketCreatedMail($ticket));
            }
        }catch (Exception $e){
            Log::error("Erreur lors de l'envoi de l'email : " . $e->getMessage());
        }

        /**
         * Notification de commande pour le gestionnaire
         */
        try {
            $gestionnaires = User::whereHas('role', function ($query) {
                $query->where('name', 'Gestionnaire');
            })->get();

            foreach ($gestionnaires as $gestionnaire) {
                if ($gestionnaire->email) {
                    Mail::to($gestionnaire->email)->send(new NewOrderNotificationMail($ticket));
                }
            }
        } catch (Exception $e) {
            Log::error("Echec de l'envoi du mail gestionnaire : " . $e->getMessage());
        }

        return $ticket;
    }
}
