@component('mail::message')
# Bonjour {{ $ticket->user->name }},

Bonne nouvelle ! Votre commande **#{{ $ticket->code }}** est désormais **prête à être récupérée** chez **Pressing LIC**.

Vous trouverez votre reçu de paiement/dépôt en pièce jointe de cet email.

**Montant total :** {{ number_format($ticket->montant_total, 0, ',', ' ') }} FCFA
**Statut de paiement :** {{ $ticket->is_paid ? 'Payé' : 'À régler sur place' }}

À très vite dans notre établissement !

Cordialement,
L'équipe **Pressing LIC**
@endcomponent
