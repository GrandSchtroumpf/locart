import { NgModule } from '@angular/core';
import { AuthActionComponent } from './action.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImgModule } from '@locart/media/img';
import { PageModule } from '@locart/utils';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@NgModule({
  declarations: [AuthActionComponent],
  imports: [
    PageModule.forChild(AuthActionComponent),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ImgModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'auth',
    },
  ],
})
export class AuthActionModule {}
