import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { throwIfAlreadyLoaded } from '../utils/angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
const routes: Routes = [
  {
    path: 'signup',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpPageModule),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), AngularFireAuthModule],
})
export class AuthModule {
  constructor(@Optional() @SkipSelf() parentModule?: AuthModule) {
    throwIfAlreadyLoaded(parentModule, 'AuthModule');
  }
}
