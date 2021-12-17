import { NgModule } from '@angular/core';
import { PaintingViewComponent } from './view.component';

import { PageModule } from '@locart/utils';
import { ImgModule } from '@locart/media/img';
import { CarouselModule } from '@locart/media/carousel';
import { StaticTagsModule } from '@locart/ui/static-tags';


import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PaintingViewComponent
  ],
  imports: [
    PageModule.forChild(PaintingViewComponent),
    ImgModule,
    StaticTagsModule,
    CarouselModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class PaintingViewModule { }
