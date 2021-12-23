import { NgModule } from '@angular/core';
import { TypeComponent } from './type.component';
import { PageModule } from '@locart/utils';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ImgModule } from '@locart/media/img';



@NgModule({
  declarations: [
    TypeComponent
  ],
  imports: [
    PageModule.forChild(TypeComponent),
    ImgModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'workshop'
  }]
})
export class TypeModule { }
