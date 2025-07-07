import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userData = localStorage.getItem('signUpUsers');
    if (userData) {
      const users = JSON.parse(userData);
      const isLoggedIn = users.some((user: any) => user.isActive);
      if (isLoggedIn) {
        return true;
      }
    }

    this.router.navigate(['/user-login']);
    return false;
  }
}