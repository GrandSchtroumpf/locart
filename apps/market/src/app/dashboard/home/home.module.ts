import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { PageModule } from '@locart/utils';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    PageModule.forChild(HomeComponent),
    MatButtonModule,
    MatIconModule
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'dashboard'
  }]
})
export class HomeModule { }
