import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoRootModule } from './transloco.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { FIREBASE_CONFIG } from 'ngfire';
import env from '@env';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslocoRootModule,
    RouterModule.forRoot([{
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    }, {
      path: 'home',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    }, {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    }]),
    MatSidenavModule
  ],
  providers: [{ provide: FIREBASE_CONFIG, useValue: env.firebase }],
  bootstrap: [AppComponent],
})
export class AppModule { }
