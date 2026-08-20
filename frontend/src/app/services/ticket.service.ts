import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CreateOrderPayload, Ticket, TicketStatus } from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- Client API ---
  createOrder(payload: CreateOrderPayload): Observable<{ message: string; data: Ticket }> {
    return this.http.post<{ message: string; data: Ticket }>(`${this.baseUrl}/commandes`, payload);
  }

  getClientTickets(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tickets`);
  }

  getClientTicketDetail(id: number): Observable<{ message: string; data: Ticket }> {
    return this.http.get<{ message: string; data: Ticket }>(`${this.baseUrl}/tickets/${id}`);
  }

  // --- Admin API ---
  getAdminTickets(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/tickets`);
  }

  getRecentTickets(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/tickets`);
  }

  getAdminTicketDetail(id: number): Observable<{ message: string; data: Ticket }> {
    return this.http.get<{ message: string; data: Ticket }>(`${this.baseUrl}/admin/tickets/${id}`);
  }

  updateTicketStatus(id: number, status: TicketStatus): Observable<{ message: string; data: Ticket }> {
    return this.http.put<{ message: string; data: Ticket }>(`${this.baseUrl}/admin/tickets/${id}/status`, { statut: status });
  }

  payTicket(ticketId: number): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.baseUrl}/admin/tickets/${ticketId}/pay`, {});
  }

  cancelTicket(ticketId: number): Observable<{ message: string; data: Ticket }> {
    return this.http.put<{ message: string; data: Ticket }>(`${this.baseUrl}/admin/tickets/${ticketId}/cancel`, {});
  }
}
