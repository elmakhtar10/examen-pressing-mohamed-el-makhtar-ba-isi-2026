<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Reçu {{ $ticket->code }}</title>
    <style>
        body { font-family: sans-serif; font-size: 13px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { color: #2563eb; margin: 0; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th { background-color: #2563eb; color: white; padding: 8px; text-align: left; }
        .table td { border-bottom: 1px solid #ddd; padding: 8px; }
        .text-right { text-align: right; }
        .total { margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold; color: #2563eb; }
    </style>
</head>
<body>
<div class="header">
    <h1>PRESSING LIC</h1>
    <p>Service de Nettoyage & Repassage Professionnel</p>
</div>

<p><strong>Code Commande :</strong> {{ $ticket->code }}</p>
<p><strong>Client :</strong> {{ $ticket->user->name }} ({{ $ticket->user->phone }})</p>
<p><strong>Date :</strong> {{ $ticket->created_at->format('d/m/Y H:i') }}</p>

<table class="table">
    <thead>
    <tr>
        <th>Service</th>
        <th>Quantité</th>
        <th class="text-right">Prix Unitaire</th>
        <th class="text-right">Sous-Total</th>
    </tr>
    </thead>
    <tbody>
    @foreach($ticket->services as $service)
        <tr>
            <td>{{ $service->libelle }}</td>
            <td>{{ $service->pivot->quantite }}</td>
            <td class="text-right">{{ number_format($service->pivot->prix_unitaire, 0, ',', ' ') }} FCFA</td>
            <td class="text-right">{{ number_format($service->pivot->quantite * $service->pivot->prix_unitaire, 0, ',', ' ') }} FCFA</td>
        </tr>
    @endforeach
    </tbody>
</table>

<div class="total">
    TOTAL : {{ number_format($ticket->montant_total, 0, ',', ' ') }} FCFA
</div>
</body>
</html>
