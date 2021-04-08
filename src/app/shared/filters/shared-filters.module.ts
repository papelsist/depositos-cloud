import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SolicitudesFilterComponent } from './solicitudes-filter/solicitudes-filter.component';
import { SolicitudesFilterModalComponent } from './solicitudes-filter/solicitudes-filter-modal.component';
@NgModule({
  imports: [FormsModule, ReactiveFormsModule, IonicModule],
  declarations: [SolicitudesFilterComponent, SolicitudesFilterModalComponent],
  exports: [SolicitudesFilterComponent],
  providers: [],
})
export class SharedFiltersModule {}
