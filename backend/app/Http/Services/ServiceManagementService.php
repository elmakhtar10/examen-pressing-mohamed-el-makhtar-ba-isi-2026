<?php

namespace App\Http\Services;

use App\Models\Service;

class ServiceManagementService{

    public function getCatalogue(?string $libelle = null){
        return Service::query()
            ->when($libelle, function ($query, $libelle) {
                return $query->where('libelle', 'like', '%' . $libelle . '%');
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
