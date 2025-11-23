import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }

    // Get the user's role
    const userRole = this.authService.getUserRole();
    const requiredRoles = route.data['roles'];

    // If the route requires specific roles and the user doesn't have them, deny access
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(userRole)) {
        // Redirect to default role-based page
        if (userRole === 'DOCTOR') {
          this.router.navigate(['/doctor-dashboard']);
        } else if (userRole === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/book-appointment']);
        }
        return false;
      }
    }

    return true;
  }
}
