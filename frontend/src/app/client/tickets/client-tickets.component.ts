import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-client-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-tickets.component.html'
})
export class ClientTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = false;

  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.ticketService.getClientTickets().subscribe({
      next: (res) => {
        const raw = res?.data?.data || res?.data || [];
        this.tickets = Array.isArray(raw) ? raw : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement tickets client', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getStatusStep(statut: string): number {
    switch (statut) {
      case 'recu':
      case 'reçu': return 1;
      case 'en_traitement': return 2;
      case 'pret': return 3;
      case 'recupere': return 4;
      default: return 1;
    }
  }

  getStatusBadgeClass(statut: string): string {
    switch (statut) {
      case 'recu':
      case 'reçu': return 'bg-slate-100 text-slate-700';
      case 'en_traitement': return 'bg-blue-100 text-blue-800';
      case 'pret': return 'bg-indigo-100 text-indigo-800';
      case 'recupere': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'recu':
      case 'reçu': return 'Reçu / En attente';
      case 'en_traitement': return 'En cours de nettoyage';
      case 'pret': return 'Prêt à être retiré';
      case 'recupere': return 'Commande Récupérée';
      default: return statut;
    }
  }
}
