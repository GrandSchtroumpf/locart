import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "@locart/auth";
import { map } from "rxjs";



@Injectable({ providedIn: 'root' })
export class RentGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(){
    return this.auth.profile$.pipe(
      map(profile => profile?.type === 'buyer' || this.router.parseUrl('/'))
    );
  }
}
