import { NgModule } from '@angular/core';
import { VerificationComponent } from './verification.component';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ImgModule } from '@locart/media/img';
import { PageModule } from '@locart/utils';

@NgModule({
  declarations: [VerificationComponent],
  imports: [
    PageModule.forChild(VerificationComponent),
    TranslocoModule,
    ImgModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'auth',
  }],
})
export class VerificationModule {}
