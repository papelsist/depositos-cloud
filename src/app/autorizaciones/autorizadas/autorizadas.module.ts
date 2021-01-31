import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AutorizadasPage } from './autorizadas.page';
import { AutorizadasListComponent } from './autorizadas-list/autorizadas-list.component';

const routes: Routes = [
  {
    path: '',
    component: AutorizadasPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [AutorizadasPage, AutorizadasListComponent],
})
export class AutorizadasPageModule {}
