import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkshopGuard } from './guard';



@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
      canActivate: [WorkshopGuard]
    }, {
      path: 'home',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    }, {
      path: 'painting/:paintingId',
      loadChildren: () => import('./painting/painting.module').then(m => m.PaintingModule)
    }])
  ],
})
export class WorkshopModule { }
