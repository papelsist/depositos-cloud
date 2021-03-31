import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInHours,
  addBusinessDays,
} from 'date-fns';
import { es } from 'date-fns/locale';

import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitudes-autorizadas-list',
  templateUrl: './autorizadas-list.component.html',
  styleUrls: ['./autorizadas-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizadasListComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[] = [];
  constructor() {}

  ngOnInit() {}

  autorizadoDesde(sol: SolicitudDeDeposito) {
    let fecha = sol.autorizacion.fecha.toDate();
    return formatDistanceToNowStrict(fecha, {
      addSuffix: true,
      locale: es,
    });
  }
}
