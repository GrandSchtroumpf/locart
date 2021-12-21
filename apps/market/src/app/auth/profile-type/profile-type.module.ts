import { NgModule } from '@angular/core';
import { SelectionComponent } from './profile-type.component';
import { PageModule } from '@locart/utils';
import { ImgModule } from '@locart/media/img';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    SelectionComponent
  ],
  imports: [
    PageModule.forChild(SelectionComponent),
    ImgModule,
    MatRippleModule
  ]
})
export class SelectionModule { }
