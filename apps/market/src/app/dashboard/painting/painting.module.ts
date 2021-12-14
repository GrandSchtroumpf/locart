import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PaintingComponent } from './painting.component';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MediaModule } from '@locart/media/upload';
import { PageModule } from '@locart/utils';
import { ConfirmExitModule } from '@locart/ui/confirm';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmGuard } from '@locart/ui/confirm';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    PaintingComponent
  ],
  imports: [
    PageModule,
    RouterModule.forChild([{
      path: '',
      canDeactivate: [ConfirmGuard],
      component: PaintingComponent,
    }]),
    ReactiveFormsModule,
    ConfirmExitModule,
    MediaModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'dashboard'
  }]
})
export class PaintingModule { }
