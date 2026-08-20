import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-admin-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-tickets.component.html'
})
export class AdminTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  loading = false;
  searchQuery = '';
  statusFilter = 'all';

  // Payment modal state
  selectedTicketForPayment: Ticket | null = null;
  paymentLoading = false;
  paymentErrorMessage = '';

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
    this.ticketService.getAdminTickets().subscribe({
      next: (res) => {
        const raw = res?.data?.data || res?.data || [];
        this.tickets = Array.isArray(raw) ? raw : [];
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement tickets admin', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {
    let result = [...this.tickets];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(t =>
        t.code?.toLowerCase().includes(q) ||
        t.user?.name?.toLowerCase().includes(q) ||
        t.client_nom?.toLowerCase().includes(q)
      );
    }

    if (this.statusFilter !== 'all') {
      result = result.filter(t => t.statut === this.statusFilter);
    }

    this.filteredTickets = result;
    this.cdr.markForCheck();
  }

  updateStatus(ticket: Ticket, nextStatus: TicketStatus): void {
    if (nextStatus === 'recupere' && !ticket.is_paid) {
      alert('Ce ticket doit être payé avant de pouvoir passer au statut "Récupéré".');
      this.openPaymentModal(ticket);
      return;
    }

    this.ticketService.updateTicketStatus(ticket.id, nextStatus).subscribe({
      next: () => this.loadTickets(),
      error: (err) => alert(err.error?.message || 'Erreur mise à jour statut.')
    });
  }

  openPaymentModal(ticket: Ticket): void {
    this.selectedTicketForPayment = ticket;
    this.paymentErrorMessage = '';
    this.cdr.markForCheck();
  }

  closePaymentModal(): void {
    this.selectedTicketForPayment = null;
    this.cdr.markForCheck();
  }

  confirmPayment(): void {
    if (!this.selectedTicketForPayment) return;

    this.paymentLoading = true;
    this.paymentErrorMessage = '';
    this.cdr.markForCheck();

    this.ticketService.payTicket(this.selectedTicketForPayment.id).subscribe({
      next: () => {
        this.paymentLoading = false;
        this.closePaymentModal();
        this.loadTickets();
      },
      error: (err) => {
        this.paymentLoading = false;
        this.paymentErrorMessage = err.error?.message || 'Erreur enregistrement paiement.';
        this.cdr.markForCheck();
      }
    });
  }

  cancelTicket(ticket: Ticket): void {
    if (confirm(`Voulez-vous annuler le ticket #${ticket.code} ?`)) {
      this.ticketService.cancelTicket(ticket.id).subscribe({
        next: () => this.loadTickets(),
        error: (err) => alert(err.error?.message || 'Impossible d\'annuler ce ticket.')
      });
    }
  }

  getStatusBadgeClass(statut: TicketStatus): string {
    switch (statut) {
      case 'recu':
      case 'reçu': return 'bg-slate-100 text-slate-700';
      case 'en_traitement': return 'bg-blue-100 text-blue-800';
      case 'pret': return 'bg-indigo-100 text-indigo-800';
      case 'recupere': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  }

  getStatusLabel(statut: TicketStatus): string {
    switch (statut) {
      case 'recu':
      case 'reçu': return 'Reçu';
      case 'en_traitement': return 'En traitement';
      case 'pret': return 'Prêt';
      case 'recupere': return 'Récupéré';
      default: return statut;
    }
  }
}
