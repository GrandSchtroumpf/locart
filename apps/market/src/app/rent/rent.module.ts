import { NgModule } from '@angular/core';
import { RentComponent } from './rent.component';
import { PageModule } from '@locart/utils';
import { MatRippleModule } from '@angular/material/core';
import { ImgModule } from '@locart/media/img';
import { MatToolbarModule } from '@angular/material/toolbar';



@NgModule({
  declarations: [
    RentComponent
  ],
  imports: [
    PageModule.forChild(RentComponent),
    ImgModule,
    MatRippleModule,
    MatToolbarModule,
  ]
})
export class RentModule { }
