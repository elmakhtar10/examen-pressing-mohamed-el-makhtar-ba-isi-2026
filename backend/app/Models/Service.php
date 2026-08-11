<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'libelle',
        'disponibilite',
        'prix_unitaire',
        'description',
    ];

    public function tickets()
    {
        return $this->belongsToMany(Ticket::class, 'ticket_service')
            ->withPivot('quantite', 'prix_unitaire')
            ->withTimestamps();
    }
}
