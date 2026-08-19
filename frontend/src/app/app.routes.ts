import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard, adminGuard } from './utils/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Espace Admin / Gestionnaire (Protégé)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      // { path: 'dashboard', component: DashboardComponent },
    ]
  },

  { path: '**', redirectTo: 'login' }
];
