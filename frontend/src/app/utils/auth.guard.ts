import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  const userInfo = localStorage.getItem('user_info');
  const user = userInfo ? JSON.parse(userInfo) : null;

  if (user?.role?.name === 'Gestionnaire' || authService.isAdmin()) {
    return true;
  }

  return router.parseUrl('/client/tickets');
};
