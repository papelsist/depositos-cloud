import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AurorizadaPage } from './aurorizada.page';
import { SharedUiSolicitudesModule } from '@papx/shared/ui-solicitudes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AurorizadaPage,
      },
    ]),
    SharedUiSolicitudesModule,
  ],
  declarations: [AurorizadaPage],
})
export class AurorizadaPageModule {}
