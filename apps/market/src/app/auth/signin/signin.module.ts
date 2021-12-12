import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SeoModule } from '@locart/utils';
import { SigninComponent } from './signin.component';

import { PupilPositionPipe } from './pipe';
import { IconService, PageModule } from '@locart/utils';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { HttpClientModule } from '@angular/common/http';

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
    MatToolbarModule,
    HttpClientModule, // Required for MatIconRegistry
  ],
  providers: [
    IconService,
    MatIconRegistry,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'auth',
    }
  ],
})
export class SigninModule {}
