import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TranslocoRootModule } from './transloco.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { FIREBASE_CONFIG } from 'ngfire';
import { IsConnectedGuard } from '@locart/auth';
import env from '@env';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    BrowserTransferStateModule,
    TranslocoRootModule,
    MatSidenavModule,
    MatListModule,
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
    }, {
      path: 'search',
      loadChildren: () => import('./search/search.module').then(m => m.SearchModule)
    }, {
      path: 'profile',
      canActivate: [IsConnectedGuard],
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
    }]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
      enabled: env.production,
    })
  ],
  providers: [{ provide: FIREBASE_CONFIG, useValue: env.firebase }],
  bootstrap: [AppComponent],
})
export class AppModule { }
