import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AutorizacionRechazo } from '@papx/models';

import parseISO from 'date-fns/parseISO';
import es from 'date-fns/locale/es';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

@Component({
  selector: 'papx-rechazo-info',
  template: `
    <ion-item [color]="color">
      <ion-label class="ion-text-wrap">
        <p class="motivo">
          Rechazo: {{ rechazo.comentario }} / {{ rechazo.motivo }}
        </p>
        <p>
          Por: {{ rechazo.user.displayName }}
          <span class="ion-padding-start">
            {{ distanceFromNow(rechazo.fecha) }}
          </span>
          <span class="ion-padding-start">{{
            rechazo.fecha | date: 'dd/MMM/yyyy HH:mm'
          }}</span>
        </p>
      </ion-label>
      <ion-icon name="warning" slot="start"></ion-icon>
    </ion-item>
  `,
  styles: [
    `
      .motivo {
        font-weight: bold;
        font-size: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechazoInfoComponent implements OnInit {
  @Input() rechazo: AutorizacionRechazo;
  @Input() color = 'warning';
  constructor() {}

  ngOnInit() {}

  distanceFromNow(fechaIni: string) {
    let fecha = parseISO(fechaIni);
    return formatDistanceToNowStrict(fecha, {
      addSuffix: true,
      locale: es,
    });
  }
}
