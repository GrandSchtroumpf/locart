import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent, PathToIdPipe } from './carousel.component';
import { ImgModule } from '../img';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'
import { LetModule } from '@rx-angular/template';


@NgModule({
  declarations: [
    CarouselComponent,
    PathToIdPipe
  ],
  imports: [
    CommonModule,
    ImgModule,
    MatButtonModule,
    MatIconModule,
    LetModule,
  ],
  exports: [CarouselComponent]
})
export class CarouselModule { }
