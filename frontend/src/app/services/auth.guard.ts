import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from '../models/ehr.models';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const expectedRoles = route.data?.['roles'] as Role[] | undefined;
  if (expectedRoles && expectedRoles.length > 0) {
    if (!authService.hasRole(...expectedRoles)) {
      // If patient, redirect to patient portal
      if (authService.isPatient()) {
        router.navigate(['/patient-portal']);
      } else {
        router.navigate(['/dashboard']);
      }
      return false;
    }
  }

  return true;
};
