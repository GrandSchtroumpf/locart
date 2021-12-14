import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaintingComponent } from './painting.component';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PageModule } from '@locart/utils';
import { MediaModule } from '@locart/media/upload';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    PaintingComponent
  ],
  imports: [
    PageModule.forChild(PaintingComponent),
    ReactiveFormsModule,
    MediaModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'dashboard'
  }]
})
export class PaintingModule { }
