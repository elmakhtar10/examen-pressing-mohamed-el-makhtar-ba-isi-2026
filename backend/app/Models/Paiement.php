<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'gestionnaire_id',
        'montant',
        'mode_paiement',
        'date_paiement',
    ];

    protected $casts = [
        'date_paiement' => 'datetime',
        'montant'       => 'decimal:2',
    ];

    /**
     * Relation avec le ticket
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * Relation avec le gestionnaire qui a encaissé
     */
    public function gestionnaire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'gestionnaire_id');
    }
}
