import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "@locart/auth";
import { map } from "rxjs";



@Injectable({ providedIn: 'root' })
export class ProfileTypeGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(){
    return this.auth.profile$.pipe(
      map(profile => {
        if (!profile) return this.router.parseUrl('/');
        if (profile.type === 'buyer') return this.router.parseUrl('/');
        if (profile.type === 'seller') return this.router.parseUrl('/workshop');
        return true;
      })
    );
  }
}
