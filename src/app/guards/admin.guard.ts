import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, GuardResult, MaybeAsync } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class adminGuard implements CanActivate{
  constructor(private router: Router, private authservice: AuthService){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    | Observable<boolean | UrlTree>
    | boolean 
    | UrlTree {

    const isAdmin = false;
    if(localStorage.getItem('isAdmin')){
      if(localStorage.getItem('isAdmin')=='true'){
        return true;
      } else {
        localStorage.clear()
        return this.router.parseUrl('/login')
      }
    } else {
      localStorage.clear()
      return this.router.parseUrl('/login')
    }
  }
}
