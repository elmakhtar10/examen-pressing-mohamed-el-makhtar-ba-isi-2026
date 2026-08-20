import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-client-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-ticket-detail.component.html'
})
export class ClientTicketDetailComponent implements OnInit {
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
    this.ticketService.getClientTicketDetail(id).subscribe({
      next: (res) => {
        const rawData = (res as any)?.data;
        const item = Array.isArray(rawData?.data) ? rawData.data[0] : (rawData || res);
        this.ticket = item || null;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur chargement du reçu.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  printReceipt(): void {
    window.print();
  }
}
