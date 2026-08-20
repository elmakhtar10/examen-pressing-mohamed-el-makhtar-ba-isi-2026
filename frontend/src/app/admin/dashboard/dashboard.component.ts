import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsService } from '../../services/stats.service';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { DailyKpis, MonthlyTicketData, RevenueByServiceData, TicketSummary } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  kpis: DailyKpis = {
    tickets_created_today: 0,
    tickets_retrieved_today: 0,
    daily_revenue: 0
  };

  monthlyTickets: MonthlyTicketData[] = [];
  revenueByService: RevenueByServiceData[] = [];
  recentTickets: TicketSummary[] = [];
  currentUser: any = null;

  monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

  constructor(
    private statsService: StatsService,
    private ticketService: TicketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadKpis();
    this.loadMonthlyTickets();
    this.loadRevenueByService();
    this.loadRecentTickets();
  }

  loadKpis(): void {
    this.statsService.getDailyKpis().subscribe({
      next: (res) => {
        this.kpis = res?.data || { tickets_created_today: 0, tickets_retrieved_today: 0, daily_revenue: 0 };
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement KPIs', err)
    });
  }

  loadMonthlyTickets(): void {
    this.statsService.getMonthlyTickets().subscribe({
      next: (res) => {
        const raw = res?.data?.data || res?.data || [];
        const rawArray: MonthlyTicketData[] = Array.isArray(raw) ? raw : [];
        
        // Formater les 12 mois complets de l'année
        const fullYear: MonthlyTicketData[] = [];
        for (let m = 1; m <= 12; m++) {
          const found = rawArray.find(item => Number(item.month) === m);
          fullYear.push({
            month: m,
            total: found ? Number(found.total) : 0
          });
        }
        
        this.monthlyTickets = fullYear;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur tickets mensuels', err)
    });
  }

  loadRevenueByService(): void {
    this.statsService.getRevenueByService().subscribe({
      next: (res) => {
        this.revenueByService = res?.data?.data || [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur CA par service', err)
    });
  }

  loadRecentTickets(): void {
    this.ticketService.getRecentTickets().subscribe({
      next: (res) => {
        const rawData = res?.data?.data || res?.data || [];
        this.recentTickets = Array.isArray(rawData) ? rawData.slice(0, 5) : [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur tickets récents', err)
    });
  }

  getMonthName(monthIndex: number): string {
    if (!monthIndex || monthIndex < 1 || monthIndex > 12) return `M${monthIndex || ''}`;
    return this.monthNames[monthIndex - 1];
  }

  get maxMonthlyTotal(): number {
    if (!this.monthlyTickets || this.monthlyTickets.length === 0) return 10;
    const max = Math.max(...this.monthlyTickets.map(m => Number(m.total) || 0));
    return max > 0 ? max : 10;
  }

  getBarHeight(total: number): number {
    const max = this.maxMonthlyTotal;
    const heightPercent = ((Number(total) || 0) / max) * 150;
    return Math.max(heightPercent, 6);
  }

  logout(): void {
    this.authService.logout();
  }
}
