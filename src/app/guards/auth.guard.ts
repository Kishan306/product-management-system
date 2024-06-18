import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate{
  constructor(private router: Router, private authservice: AuthService){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    | Observable<boolean | UrlTree>
    | boolean 
    | UrlTree {
    const token = localStorage.getItem('token'); // Check for token in localStorage
    const isLoggedIn = !!token; // Convert truthy/falsy to boolean

    if (isLoggedIn) {
      return true;
    } else {
      localStorage.clear()
      return this.router.parseUrl('/login');
    }
    }
}
