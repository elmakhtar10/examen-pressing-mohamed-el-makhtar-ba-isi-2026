import { Component } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {AuthResponse, LoginCredentials} from '../../models/user.model';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgOptimizedImage],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credentials: LoginCredentials = { email: '', password: '' };
  showPassword = false;
  rememberMe = false;
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (res: AuthResponse) => {
        this.loading = false;

        const roleName = res.user?.role?.name || (typeof res.user?.role === 'string' ? res.user?.role : '');
        const isGestionnaire = roleName === 'Gestionnaire' || res.user?.role_id === 1;

        if (isGestionnaire) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/client/catalogue']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || err.message || 'Identifiants incorrects. Veuillez réessayer.';
      }
    });
  }
}
