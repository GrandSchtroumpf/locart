import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "@locart/auth";
import { map } from "rxjs";



@Injectable({ providedIn: 'root' })
export class DashboardGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(){
    return this.auth.profile$.pipe(
      map(profile => profile?.isSeller || this.router.parseUrl('/'))
    );
  }
}
