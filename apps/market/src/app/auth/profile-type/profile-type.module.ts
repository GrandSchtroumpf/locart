import { NgModule } from '@angular/core';
import { SelectionComponent } from './profile-type.component';
import { PageModule } from '@locart/utils';
import { ImgModule } from '@locart/media/img';
import { MatRippleModule } from '@angular/material/core';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';


@NgModule({
  declarations: [
    SelectionComponent
  ],
  imports: [
    PageModule.forChild(SelectionComponent),
    ImgModule,
    MatRippleModule
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'auth'
  }]
})
export class SelectionModule { }
