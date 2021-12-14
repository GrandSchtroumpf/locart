import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { PageModule } from '@locart/utils';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ImgModule } from '@locart/media/img';



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
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'dashboard'
  }]
})
export class HomeModule { }
