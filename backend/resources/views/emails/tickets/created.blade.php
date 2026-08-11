@component('mail::message')
# Confirmation de dépôt de commande

Bonjour **{{ $ticket->user->name }}**,

Nous avons bien reçu votre commande chez **Pressing LIC** !

**Référence :** {{ $ticket->code }}

**Statut actuel :** {{ ucfirst($ticket->statut) }}

### Services déposés :

@component('mail::table')
| Service | Quantité | Prix Unitaire |
| :--- | :---: | :---: |
@foreach($ticket->services as $service)
| {{ $service->libelle }} | {{ $service->pivot->quantite }} | {{ number_format($service->pivot->prix_unitaire, 0, ',', ' ') }} FCFA |
@endforeach
@endcomponent

**Montant total :** {{ number_format($ticket->montant_total, 0, ',', ' ') }} FCFA

Merci pour votre confiance !

Cordialement,
L'équipe **Pressing LIC**
@endcomponent
