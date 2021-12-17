import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PaintingListComponent } from './list.component';
import { dateAdapterProviders, PageModule } from '@locart/utils';
import { ImgModule } from '@locart/media/img';
import { StaticSelectModule } from '@locart/ui/static-select';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';


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
    MatDatepickerModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'search'
    },
    ...dateAdapterProviders
  ]
})
export class PaintingListModule { }
