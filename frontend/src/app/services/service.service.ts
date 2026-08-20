import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Service, CreateServiceData, UpdateServiceData } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly apiUrl = `${environment.apiUrl}/admin/services`;

  constructor(private http: HttpClient) {}

  getCatalogue(libelle?: string): Observable<{ message: string; count: number; data: Service[] }> {
    let params = new HttpParams();
    if (libelle && libelle.trim()) {
      params = params.set('libelle', libelle.trim());
    }
    return this.http.get<{ message: string; count: number; data: Service[] }>(this.apiUrl, { params });
  }

  getService(id: number): Observable<{ message: string; data: Service }> {
    return this.http.get<{ message: string; data: Service }>(`${this.apiUrl}/${id}`);
  }

  createService(data: CreateServiceData): Observable<{ message: string; data: Service }> {
    return this.http.post<{ message: string; data: Service }>(this.apiUrl, data);
  }

  updateService(id: number, data: UpdateServiceData): Observable<{ message: string; data: Service }> {
    return this.http.put<{ message: string; data: Service }>(`${this.apiUrl}/${id}`, data);
  }

  toggleAvailability(id: number, currentStatus: 'actif' | 'inactif'): Observable<{ message: string; data: Service }> {
    const newStatus = currentStatus === 'actif' ? 'inactif' : 'actif';
    return this.updateService(id, { disponibilite: newStatus });
  }

  deleteService(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
