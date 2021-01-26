import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RechazadasPageRoutingModule } from './rechazadas-routing.module';

import { RechazadasPage } from './rechazadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RechazadasPageRoutingModule
  ],
  declarations: [RechazadasPage]
})
export class RechazadasPageModule {}
