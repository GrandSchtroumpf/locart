import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'la-confirm-exit',
  templateUrl: 'confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'confirm',
  }],
})
export class ConfirmExitComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private valid: boolean) {}

  get read() {
    return this.valid ? 'confirm.valid' : 'confirm.invalid';
  }
  get color() {
    return this.valid ? 'primary' : 'warn';
  }
}
