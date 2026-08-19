import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  logout(): void {
    const logoutUrl = this.isAdmin() ? `${this.apiUrl}/admin/logout` : `${this.apiUrl}/logout`;

    this.http.post(logoutUrl, {}).subscribe({
      next: () => this.clearStorageAndRedirect(),
      error: () => this.clearStorageAndRedirect()
    });
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role?.name === 'Gestionnaire';
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user_info', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private clearStorageAndRedirect(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user_info');
    return user ? JSON.parse(user) : null;
  }
}
