import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslocoRootModule } from './transloco.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslocoRootModule,
    RouterModule.forRoot([]),
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
