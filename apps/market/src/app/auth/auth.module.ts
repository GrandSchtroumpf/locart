import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./signin/signin.module').then((m) => m.SigninModule),
  },
  {
    path: 'verification',
    loadChildren: () =>
      import('./verification/verification.module').then((m) => m.VerificationModule),
  },
  {
    path: 'change-password/:email',
    loadChildren: () =>
      import('./change-password/change-password.module').then((m) => m.ChangePasswordModule),
  },
  {
    path: 'action',
    loadChildren: () => import('./action/action.module').then((m) => m.AuthActionModule),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class AuthModule {}
