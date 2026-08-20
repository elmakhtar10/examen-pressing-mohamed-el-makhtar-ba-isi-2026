import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ServicesListComponent } from './admin/services/services-list.component';
import { AdminTicketsComponent } from './admin/tickets/admin-tickets.component';
import { AdminTicketDetailComponent } from './admin/tickets/admin-ticket-detail.component';
import { ClientCatalogueComponent } from './client/catalogue/client-catalogue.component';
import { ClientTicketsComponent } from './client/tickets/client-tickets.component';
import { ClientTicketDetailComponent } from './client/tickets/client-ticket-detail.component';
import { authGuard, adminGuard } from './utils/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // Espace Admin / Gestionnaire
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'services', component: ServicesListComponent },
          { path: 'tickets', component: AdminTicketsComponent },
          { path: 'tickets/:id', component: AdminTicketDetailComponent },
        ]
      },
      // Espace Client
      {
        path: 'client',
        children: [
          { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
          { path: 'catalogue', component: ClientCatalogueComponent },
          { path: 'tickets', component: ClientTicketsComponent },
          { path: 'tickets/:id', component: ClientTicketDetailComponent },
        ]
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
