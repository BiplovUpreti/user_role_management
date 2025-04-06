import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';

export const permissionGuard = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  const user = authStore.getCurrentUser();
  if (user?.role?.userType === 'ADMIN') {
    return true;
  }

  router.navigate(['/']);
  return false;
};