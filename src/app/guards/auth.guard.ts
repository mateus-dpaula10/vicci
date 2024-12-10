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

  const requiredRole: string[] = route.data['roles']
  if (requiredRole && !requiredRole.includes(currentUser.role)) {
    router.navigate(['/dashboard'])
    return false
  }

  return true
};
