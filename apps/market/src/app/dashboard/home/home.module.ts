import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PageModule } from '@locart/utils';
import { ImgModule } from '@locart/media/img';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    PageModule.forChild(HomeComponent),
    ImgModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatRippleModule,
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'dashboard'
  }]
})
export class HomeModule { }
