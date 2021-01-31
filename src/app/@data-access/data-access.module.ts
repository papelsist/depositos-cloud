import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../utils/angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
})
export class DataAccessModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: DataAccessModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'DataAccessModule');
  }
}
