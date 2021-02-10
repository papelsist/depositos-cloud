import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {
  redirectLoggedInToHome,
  redirectUnverifiedToPending,
  redirectVeifiedToHome,
  redirectUnauthorized,
} from '@papx/auth';

import { canActivate } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    // ...canActivate(redirectUnverifiedToPending),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'solicitudes',
    loadChildren: () =>
      import('./solicitudes/solicitudes-tab/solicitudes-tab.module').then(
        (m) => m.SolicitudesTabPageModule
      ),
  },
  {
    path: 'autorizaciones',
    loadChildren: () =>
      import(
        './autorizaciones/autotirzaciones-tab/autotirzaciones-tab.module'
      ).then((m) => m.AutotirzacionesTabPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./@auth/login/login.module').then((m) => m.LoginPageModule),
    // ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'pending',
    loadChildren: () =>
      import('./@auth/pending/pending.module').then((m) => m.PendingPageModule),
    // ...canActivate(redirectUnauthorized),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
