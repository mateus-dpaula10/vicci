import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  const currentUser = await authService.getCurrentUser()

  if (!currentUser) {
    router.navigate(['/login'])
    return false
  }

  const requiredRoles = route.data?.['roles']
  const userRole = currentUser.role

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    router.navigate(['/login'])
    return false
  }

  return true
};
