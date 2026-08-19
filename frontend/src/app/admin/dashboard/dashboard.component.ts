import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../services/stats.service';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { DailyKpis, MonthlyTicketData, RevenueByServiceData, TicketSummary } from '../../models/dashboard.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  kpis: DailyKpis = { tickets_created_today: 0, tickets_retrieved_today: 0, daily_revenue: 0 };
  monthlyTickets: MonthlyTicketData[] = [];
  revenueByService: RevenueByServiceData[] = [];
  recentTickets: TicketSummary[] = [];

  constructor(
    private statsService: StatsService,
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    this.loadKpis();
    this.loadMonthlyTickets();
    this.loadRevenueByService();
    this.loadRecentTickets();
  }

  loadKpis(): void {
    this.statsService.getDailyKpis().subscribe({
      next: (res) => this.kpis = res.data,
      error: (err) => console.error('Erreur KPIs', err)
    });
  }

  loadMonthlyTickets(): void {
    this.statsService.getMonthlyTickets(2026).subscribe({
      next: (res) => this.monthlyTickets = res.data.data,
      error: (err) => console.error('Erreur tickets mensuels', err)
    });
  }

  loadRevenueByService(): void {
    this.statsService.getRevenueByService(8, 2026).subscribe({
      next: (res) => this.revenueByService = res.data.data,
      error: (err) => console.error('Erreur CA par service', err)
    });
  }

  loadRecentTickets(): void {
    this.ticketService.getRecentTickets().subscribe({
      next: (res) => {
        this.recentTickets = res.data.slice(0, 5);
      },
      error: (err) => console.error('Erreur chargement tickets récents', err)
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
