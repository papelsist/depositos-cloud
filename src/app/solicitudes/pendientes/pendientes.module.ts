import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendientesPageRoutingModule } from './pendientes-routing.module';

import { PendientesPage } from './pendientes.page';
import { SharedUiSolicitudesModule } from '@papx/shared/ui-solicitudes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendientesPageRoutingModule,
    SharedUiSolicitudesModule,
  ],
  declarations: [PendientesPage],
})
export class PendientesPageModule {}
