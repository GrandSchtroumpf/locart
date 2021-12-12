import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { PageModule } from '@locart/utils';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    PageModule.forChild(ProfileComponent),
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [{
    provide: TRANSLOCO_SCOPE,
    useValue: 'profile'
  }]
})
export class ProfileModule { }
