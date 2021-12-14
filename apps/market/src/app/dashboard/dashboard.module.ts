import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardGuard } from './guard';



@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
      canActivate: [DashboardGuard]
    }, {
      path: 'home',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    }, {
      path: 'painting',
      loadChildren: () => import('./painting/painting.module').then(m => m.PaintingModule)
    }])
  ],
})
export class DashboardModule { }
