import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');     

    if (this.authService.isLoggedIn()) {
      if (roles.includes('Admin')) {
        return true;     
      } 
      else if (roles.includes('Manager')) {
        this.router.navigate(['/manager-dashboard']);
        return false;
      } 
      else if (roles.includes('Cashier')) {
        this.router.navigate(['/unauthorized']); 
        return false;
      } 
      else {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    } else {
      this.router.navigate(['/welcome']); 
      return false;
    }
  }
};
