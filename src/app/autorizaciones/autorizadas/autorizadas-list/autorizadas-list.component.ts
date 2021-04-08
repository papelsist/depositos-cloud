import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { formatDistanceToNowStrict } from 'date-fns';
import es from 'date-fns/locale/es';

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
