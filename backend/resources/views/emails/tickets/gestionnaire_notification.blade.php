@component('mail::message')# 🔔 Notification : Nouvelle Commande Reçue

Une nouvelle commande vient d'être déposée par le client **{{ $ticket->user->name }}** ({{ $ticket->user->email }} / {{ $ticket->user->phone }}).

**Référence commande :** {{ $ticket->code }}
**Montant total :** {{ number_format($ticket->montant_total, 0, ',', ' ') }} FCFA
**Statut :** {{ ucfirst($ticket->statut) }}

### Détails des articles déposés :

@component('mail::table')
| Service | Quantité | Prix Unitaire | Sous-total |
| :--- | :---: | :---: | :---: |
@foreach($ticket->services as $service)
| {{ $service->libelle }} | {{ $service->pivot->quantite }} | {{ number_format($service->pivot->prix_unitaire, 0, ',', ' ') }} FCFA | {{ number_format($service->pivot->quantite * $service->pivot->prix_unitaire, 0, ',', ' ') }} FCFA |
@endforeach
@endcomponent

Merci de traiter cette commande dans les meilleurs délais.

Cordialement,
**Système Pressing LIC**
@endcomponent
