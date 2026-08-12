<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use App\Http\Services\TicketManagementService;
use App\Models\Ticket;
use App\Models\TicketService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct(protected TicketManagementService $ticketManagementService){}

    /**
     * @param Request $request
     * @return JsonResponse
     * Déposer une commande
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'services'              => ['required', 'array', 'min:1'],
            'services.*.service_id' => ['required', 'integer', 'exists:services,id'],
            'services.*.quantite'   => ['required', 'numeric', 'gt:0'],
        ]);

        try {
            $ticket = $this->ticketManagementService->createTicket(
                $request->user()->id,
                $validated['services']
            );

            return response()->json([
                'message' => 'Commande déposée avec succès et email de confirmation envoyé.',
                'data'    => $ticket
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur lors du dépôt de la commande.',
                'error'   => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * Suivre le statut de sa commande.
     */
    public function index(Request $request): JsonResponse{
        $tickets = Ticket::with(['services'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'message' => 'Historique de vos commandes récupéré avec succès.',
            'data'    => $tickets
        ]);
    }

    /**
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     * Consulter le détail d'une commande + Reçu
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $ticket = Ticket::with(['services', 'user'])
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->paginate(10)
            ->first();

        if (!$ticket) {
            return response()->json([
                'message' => 'Commande introuvable.'
            ], 404);
        }

        return response()->json([
            'message' => 'Détail de la commande et du reçu.',
            'data'    => $ticket
        ]);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * Permet au gestionnaire de voir toutes les commandes déposées.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $tickets = Ticket::with(['user:id,name,email,phone', 'services'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'message' => 'Ensemble des tickets récupéré avec succès.',
            'data'    => $tickets
        ], 200);
    }

    /**
     * @param int $id
     * @return JsonResponse
     * Permet au gestionnaire de voir le détail des tickets
     */
    public function adminShow(int $id): JsonResponse
    {
        $ticket = Ticket::with(['user', 'services'])->find($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket introuvable.'
            ], 404);
        }

        return response()->json([
            'message' => 'Détail du ticket récupéré avec succès.',
            'data'    => $ticket
        ], 200);
    }

}
