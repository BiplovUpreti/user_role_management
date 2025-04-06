import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthStore);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
