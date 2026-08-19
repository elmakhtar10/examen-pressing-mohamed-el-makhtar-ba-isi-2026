import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { TicketSummary } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  getRecentTickets(): Observable<{ data: TicketSummary[] }> {
    return this.http.get<{ data: TicketSummary[] }>(`${this.apiUrl}`);
  }
}
