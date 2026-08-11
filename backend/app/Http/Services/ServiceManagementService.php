<?php

namespace App\Http\Services;

use App\Models\Service;

class ServiceManagementService{

    public function getCatalogue(?string $libelle = null){
        return Service::query()
            ->where('disponibilite', 'actif')
            ->when($libelle, function ($query, $libelle) {
                return $query->where('libelle', 'ilike', '%' . $libelle . '%');
            })->get();
    }
}
