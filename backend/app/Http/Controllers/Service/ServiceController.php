<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\Http\Services\ServiceManagementService;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use function Pest\Laravel\json;

class ServiceController extends Controller
{
    public function __construct(protected ServiceManagementService $serviceManagementService){

    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $request->validate([
            'libelle' => ['nullable', 'string', 'max:255'],
        ]);
        $libelle = $request->query('libelle');
        $services = $this->serviceManagementService->getCatalogue($libelle);
        return response()->json([
            'message' => 'Catalogue des services récupéré avec succès.',
            'count'   => $services->count(),
            'data'    => $services
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'libelle' => ['required', 'string'],
            'prix_unitaire' => ['required'],
            'description' => ['required'],
            'disponibilite' => ['nullable'],
        ]);

        $service = Service::create($validated);

        return response()->json([
            'message' => 'Service creer avec succes',
            'data' => $service
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        return response()->json([
            'message' => 'Détails du service',
            'data'    => $service
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'libelle' => ['sometimes', 'string'],
            'prix_unitaire' => ['sometimes'],
            'description' => ['sometimes'],
            'disponibilite' => ['sometimes'],
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Service modifier avec succes',
            'data' => $service
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json([
            'message' => 'Service supprimer avec succes'
        ], 200);
    }

    /**
     * @param Service $service
     * @return JsonResponse
     * Archiver un service
     */
    public function archive(Service $service){
        if ($service->disponibilite === 'inactif') {
            return response()->json([
                'message' => 'Ce service est déjà archivé.'
            ], 400);
        }

        $service->update(['disponibilite' => 'inactif']);
        return response()->json([
            'message' => 'Service archivé avec succès.',
            'data' => $service
        ], 200);
    }
}
