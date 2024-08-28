// auth.guard.ts
// now I use the observable to check if the user is authenticated
// the guard is set up 'inject' dependencies such as router and authService.

import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const authService = inject(AuthService); // Use `inject` to get the service
  const router = inject(Router);           // Use `inject` to get the router

  return authService.authState$.pipe(
    map(user => !!user), // Convert user object to boolean (true if logged in, false if not)
    tap(loggedIn => {
      if (!loggedIn) {
        // If the user is not logged in, redirect to the login page
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      }
    })
  );
};

