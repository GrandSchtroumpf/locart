import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticTagComponent, StaticTagListComonent } from './static-tags.component';
import { TranslocoModule } from '@ngneat/transloco';



@NgModule({
  declarations: [
    StaticTagComponent,
    StaticTagListComonent
  ],
  exports: [
    StaticTagComponent,
    StaticTagListComonent
  ],
  imports: [
    CommonModule,
    TranslocoModule
  ]
})
export class StaticTagsModule { }
