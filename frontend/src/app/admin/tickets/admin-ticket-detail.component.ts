import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket, TicketStatus } from '../../models/ticket.model';

@Component({
  selector: 'app-admin-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-ticket-detail.component.html'
})
export class AdminTicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadTicketDetail(parseInt(idParam, 10));
    }
  }

  loadTicketDetail(id: number): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.ticketService.getAdminTicketDetail(id).subscribe({
      next: (res) => {
        const rawData = (res as any)?.data;
        const item = Array.isArray(rawData?.data) ? rawData.data[0] : (rawData || res);
        this.ticket = item || null;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement du ticket.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  updateStatus(nextStatus: TicketStatus): void {
    if (!this.ticket) return;

    if (nextStatus === 'recupere' && !this.ticket.is_paid) {
      alert('Ce ticket doit être payé avant de pouvoir être marqué comme récupéré.');
      return;
    }

    this.ticketService.updateTicketStatus(this.ticket.id, nextStatus).subscribe({
      next: (res) => {
        const rawData = (res as any)?.data;
        const item = Array.isArray(rawData?.data) ? rawData.data[0] : (rawData || res);
        if (item) this.ticket = item;
        this.loadTicketDetail(this.ticket!.id);
      },
      error: (err) => alert(err.error?.message || 'Erreur lors du changement de statut.')
    });
  }

  payTicket(): void {
    if (!this.ticket) return;

    this.ticketService.payTicket(this.ticket.id).subscribe({
      next: () => this.loadTicketDetail(this.ticket!.id),
      error: (err) => alert(err.error?.message || 'Erreur lors de l\'enregistrement du paiement.')
    });
  }

  printReceipt(): void {
    window.print();
  }
}
