import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaintingListComponent } from './list.component';
import { PageModule } from '@locart/utils';
import { ImgModule } from '@locart/media/img';
import { StaticSelectModule } from '@locart/ui/static-select';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    PaintingListComponent
  ],
  imports: [
    PageModule.forChild(PaintingListComponent),
    ReactiveFormsModule,
    ImgModule,
    StaticSelectModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSliderModule,
    MatFormFieldModule,
  ]
})
export class PaintingListModule { }
