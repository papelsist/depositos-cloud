import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../utils/angular';

@NgModule({
  declarations: [],
  imports: [CommonModule],
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
