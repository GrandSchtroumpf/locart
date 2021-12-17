import { NgModule } from '@angular/core';
import { PaintingViewComponent } from './view.component';
import { PageModule } from '@locart/utils';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    PaintingViewComponent
  ],
  imports: [
    PageModule.forChild(PaintingViewComponent),
    MatIconModule,
    MatButtonModule
  ]
})
export class PaintingViewModule { }
