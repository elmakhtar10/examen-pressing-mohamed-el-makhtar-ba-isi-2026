import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { DailyKpis, MonthlyTicketData, RevenueByServiceData } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly apiUrl = `${environment.apiUrl}/admin/stats`;

  constructor(private http: HttpClient) {}

  getDailyKpis(): Observable<{ data: DailyKpis }> {
    return this.http.get<{ data: DailyKpis }>(`${this.apiUrl}/daily`);
  }

  getMonthlyTickets(year?: number): Observable<{ data: { year: number; data: MonthlyTicketData[] } }> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<{ data: { year: number; data: MonthlyTicketData[] } }>(`${this.apiUrl}/monthly-tickets`, { params });
  }

  getRevenueByService(month?: number, year?: number): Observable<{ data: { month: number; year: number; data: RevenueByServiceData[] } }> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());

    return this.http.get<{ data: { month: number; year: number; data: RevenueByServiceData[] } }>(`${this.apiUrl}/revenue-by-service`, { params });
  }
}
