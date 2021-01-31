import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import parseISO from 'date-fns/parseISO';
import es from 'date-fns/locale/es';
import differenceInHours from 'date-fns/differenceInHours';
import addBusinessDays from 'date-fns/addBusinessDays';

@Component({
  selector: 'papx-solicitud-card',
  templateUrl: './solicitud-card.component.html',
  styleUrls: ['./solicitud-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudCardComponent implements OnInit {
  @Input() solicitud: SolicitudDeDeposito;
  retraso: string;
  retrasoHoras: number;
  constructor() {}

  ngOnInit() {
    this.updateRetraso();
  }

  updateRetraso() {
    let fecha = parseISO(this.solicitud.fecha);
    if (this.isSBC()) {
      fecha = addBusinessDays(fecha, 1); //addHours(fecha, 24);
    }
    this.retrasoHoras = differenceInHours(new Date(), fecha);
    this.retraso = formatDistanceToNowStrict(fecha, {
      addSuffix: true,
      locale: es,
    });
    // console.log('Retraso horas:', this.retrasoHoras);
  }

  get retrasoColor() {
    if (this.retrasoHoras <= 1) {
      return 'success';
    } else if (this.retrasoHoras > 1 && this.retrasoHoras < 2) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  isSBC() {
    const sbc = this.solicitud.sbc ?? false;
    const cheque = this.solicitud.cheque;
    return cheque > 0.0 && sbc;
  }
}
