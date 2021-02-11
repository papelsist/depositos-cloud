import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendientesPageRoutingModule } from './pendientes-routing.module';

import { PendientesPage } from './pendientes.page';
import { SharedUiSolicitudesModule } from '@papx/shared/ui-solicitudes';
import { AutorizarModalComponent } from './autorizar-modal/autorizar-modal.component';
import { PendientesCardsViewComponent } from './card-view/pendientes-cards-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendientesPageRoutingModule,
    SharedUiSolicitudesModule,
  ],
  declarations: [
    PendientesPage,
    AutorizarModalComponent,
    PendientesCardsViewComponent,
  ],
})
export class PendientesPageModule {}
