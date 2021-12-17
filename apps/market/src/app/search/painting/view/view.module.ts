import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaintingViewComponent } from './view.component';

import { dateAdapterProviders, PageModule } from '@locart/utils';
import { ImgModule } from '@locart/media/img';
import { CarouselModule } from '@locart/media/carousel';
import { StaticTagsModule } from '@locart/ui/static-tags';
import { PushModule } from '@rx-angular/template';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    PaintingViewComponent
  ],
  imports: [
    PageModule.forChild(PaintingViewComponent),
    ReactiveFormsModule,
    ImgModule,
    StaticTagsModule,
    CarouselModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSnackBarModule,
    PushModule,
  ],
  providers: [...dateAdapterProviders]
})
export class PaintingViewModule { }
