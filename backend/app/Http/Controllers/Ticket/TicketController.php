<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use App\Http\Services\TicketManagementService;
use App\Models\TicketService;
use Exception;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct(protected TicketManagementService $ticketManagement){}

    public function store(Request $request){
        $validated = $request->validate([
            'services' => ['required', 'array', 'min:1'],
            'services.*.service_id' => ['required', 'integer', 'exists:services,id'],
            'services.*.quantite' => ['required', 'numeric', 'gt:0'],
        ]);

        try{
            $userId = $request->user()->id;
            $ticket = $this->ticketManagement->createTicket($userId, $validated['services']);

            // TODO: Déclencher l'envoi de l'email de confirmation ici (Notification / Mail)

            return response()->json([
                'message' => 'Commande déposée avec succès.',
                'data'    => $ticket
            ], 201);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Erreur lors du dépôt de la commande.',
                'error'   => $e->getMessage()
            ], 400);
        }
    }
}
