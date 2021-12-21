import { NgModule } from '@angular/core';
import { RentComponent } from './rent.component';
import { PageModule } from '@locart/utils';
import { MatRippleModule } from '@angular/material/core';
import { ImgModule } from '@locart/media/img';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { RentGuard } from './guard';



@NgModule({
  declarations: [
    RentComponent
  ],
  imports: [
    PageModule,
    RouterModule.forChild([{
      path: '',
      component: RentComponent,
      canActivate: [RentGuard]
    }]),
    ImgModule,
    MatRippleModule,
    MatToolbarModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'rent'
  }]
})
export class RentModule { }
