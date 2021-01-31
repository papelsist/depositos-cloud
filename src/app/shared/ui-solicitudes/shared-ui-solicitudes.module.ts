import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SharedUiClientesModule } from '@papx/shared/ui-clientes';
import { SharedUiBancosModule } from '@papx/shared/ui-bancos';
import { SolicitudCardComponent } from './solicitud-card/solicitud-card.component';
import { AutorizacionCardComponent } from './autorizacion-card/autorizacion-card.component';
import { SolicitudPanelComponent } from './solicitud-panel/solicitud-panel.component';
import { AutorizacionPanelComponent } from './autorizacion-panel/autorizacion-panel.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiClientesModule,
    SharedUiBancosModule,
  ],
  declarations: [
    SolicitudCardComponent,
    AutorizacionCardComponent,
    AutorizacionPanelComponent,
    SolicitudPanelComponent,
  ],
  exports: [
    SolicitudCardComponent,
    AutorizacionCardComponent,
    SolicitudPanelComponent,
    AutorizacionPanelComponent,
  ],
})
export class SharedUiSolicitudesModule {}
