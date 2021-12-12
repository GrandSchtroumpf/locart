import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SeoModule } from '@locart/utils';
import { SigninComponent } from './signin.component';

import { PupilPositionPipe } from './pipe';
import { IconService, PageModule } from '@locart/utils';

@NgModule({
  declarations: [SigninComponent, PupilPositionPipe],
  imports: [
    PageModule.forChild(SigninComponent),
    SeoModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  providers: [IconService, MatIconRegistry],
})
export class SigninModule {}
