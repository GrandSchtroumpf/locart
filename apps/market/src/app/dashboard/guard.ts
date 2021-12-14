import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CanActivate, CanDeactivate, Router } from "@angular/router";
import { AuthService } from "@locart/auth";
import { map, Observable } from "rxjs";

export interface FormComponent {
  form: FormGroup;
  reset(): unknown;
  save(): unknown;
  confirmExit(): Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class DashboardGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(){
    return this.auth.profile$.pipe(
      map(profile => profile?.isSeller || this.router.parseUrl('/'))
    );
  }
}

@Injectable({ providedIn: 'root' })
export class FormGuard implements CanDeactivate<FormComponent> {

  canDeactivate(component: FormComponent) {
    if (component.form.pristine) return true;
    return component.confirmExit();
  }
}