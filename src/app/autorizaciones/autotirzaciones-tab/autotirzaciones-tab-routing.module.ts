import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutotirzacionesTabPage } from './autotirzaciones-tab.page';

const routes: Routes = [
  {
    path: '',
    component: AutotirzacionesTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutotirzacionesTabPageRoutingModule {}
