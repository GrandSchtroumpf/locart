import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ProfileComponent } from './profile.component';
import { PageModule } from '@locart/utils';
import { MediaModule } from '@locart/media/upload';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    PageModule.forChild(ProfileComponent),
    ReactiveFormsModule,
    MediaModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'profile'
  }]
})
export class ProfileModule { }
