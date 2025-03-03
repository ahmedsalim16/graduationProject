import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('role') || '[]');
    // const owner = JSON.parse(localStorage.getItem('owner') || 'false');
  
    if (!token) {
      this.router.navigate(['/welcome']);
      return false;
    }
    if (this.authService.isLoggedIn()) {
      if (roles.includes('Admin')) {
        this.router.navigate(['/add-school']);
        
      } else if (roles.includes('Manager')) {
        this.router.navigate(['/Dashboard']);
      }
      return true;
    } else {
      this.router.navigate(['/welcome']);
      return false;
    }
  
   
  
  }
  
};
