import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import type { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConfirmExitComponent } from './confirm.component';

export interface FormComponent {
  form: AbstractControl;
  dialog: MatDialog;
  save(): Promise<unknown>;
}

@Injectable({ providedIn: 'root' })
export class ConfirmGuard implements CanDeactivate<FormComponent> {
  constructor(private router: Router) {}
  canDeactivate(
    component: FormComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ) {
    if (component.form.pristine) return true;
    const isValid = component.form.valid;
    const dialogRef = component.dialog.open(ConfirmExitComponent, { data: isValid, maxWidth: 400 });
    return dialogRef.afterClosed().pipe(
      switchMap(async (confirm?: boolean) => {
        if (!isValid) return !!confirm;
        if (typeof confirm === 'undefined') return false; // don't leave the form
        if (confirm) {
          await component.save(); // Save before leaving
          // If form tries to navigate after save, override the candeactivate
          if (nextState) this.router.navigateByUrl(nextState.url);
        }
        return true;
      })
    );
    
  }
}
