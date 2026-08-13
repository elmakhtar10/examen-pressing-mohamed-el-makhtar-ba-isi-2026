<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Ticket extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'statut',
        'montant_total',
        'is_paid',
    ];

    protected $casts = [
        'is_paid' => 'boolean',
        'montant_total' => 'decimal:2',
    ];

    public function services(){
        return $this->belongsToMany(Service::class, 'ticket_service')
            ->withPivot('quantite', 'prix_unitaire')
            ->withTimestamps();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paiement(): HasOne
    {
        return $this->hasOne(Paiement::class);
    }

}
