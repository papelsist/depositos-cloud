import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SolicitudFormComponent } from './solicitud-form/solicitud-form.component';
import { SharedUiClientesModule } from '@papx/shared/ui-clientes';
import { SharedUiBancosModule } from '@papx/shared/ui-bancos';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiClientesModule,
    SharedUiBancosModule,
  ],
  declarations: [SolicitudFormComponent],
  exports: [SolicitudFormComponent],
})
export class SharedUiSolicitudesModule {}
