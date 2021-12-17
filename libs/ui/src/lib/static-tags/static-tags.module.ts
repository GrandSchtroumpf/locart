import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticTagsComponent } from './static-tags.component';
import { TranslocoModule } from '@ngneat/transloco';



@NgModule({
  declarations: [StaticTagsComponent],
  exports: [StaticTagsComponent],
  imports: [
    CommonModule,
    TranslocoModule
  ]
})
export class StaticTagsModule { }
