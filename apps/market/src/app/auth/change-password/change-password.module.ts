import { NgModule } from '@angular/core';
import { ChangePasswordComponent } from './change-password.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImgModule } from '@locart/media/img';
import { PageModule } from '@locart/utils';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    PageModule.forChild(ChangePasswordComponent),
    ImgModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'auth',
  }]
})
export class ChangePasswordModule {}
