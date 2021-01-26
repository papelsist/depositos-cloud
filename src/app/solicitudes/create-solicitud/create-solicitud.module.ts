import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedUiClientesModule } from '@papx/shared/ui-clientes';
import { SharedUiBancosModule } from '@papx/shared/ui-bancos';

import { CreateSolicitudPage } from './create-solicitud.page';
import { SolicitudCreateFormComponent } from './create-form/solicitud-create-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedUiClientesModule,
    SharedUiBancosModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreateSolicitudPage,
      },
    ]),
  ],
  declarations: [CreateSolicitudPage, SolicitudCreateFormComponent],
})
export class CreateSolicitudPageModule {}
