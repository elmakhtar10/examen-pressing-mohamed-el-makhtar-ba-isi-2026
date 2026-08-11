<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'statut',
        'montant_total',
        'is_paid',
    ];

    public function services(){
        return $this->belongsToMany(Service::class, 'ticket_service')
            ->withPivot('quantite', 'prix_unitaire')
            ->withTimestamps();
    }
}
