import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Autorizacion, SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-autorizar-deposito-modal',
  template: `
    <div class="ion-padding">
      <ion-list-header>
        <ion-label>
          Autorizar
          {{ solicitud.transferencia > 0.0 ? 'Transferencia' : 'Depósito' }}:
          {{ solicitud.folio }}
        </ion-label>
        <ion-button (click)="dismissModal()">Cancelar</ion-button>
      </ion-list-header>
      <ion-list>
        <ion-item>
          <ion-label>
            <h2>
              Total:
              <ion-text color="primary">{{
                solicitud.total | currency
              }}</ion-text>
            </h2>
            <h2>
              Banco origen:
              <ion-text color="primary">{{ solicitud.banco.nombre }}</ion-text>
            </h2>
            <h2>
              Cuenta destino:
              <ion-text color="primary"
                >{{ solicitud.cuenta.descripcion }} ({{
                  solicitud.cuenta.numero
                }})
              </ion-text>
            </h2>
            <h2>
              Fecha depósito:
              <ion-text color="primary">{{
                solicitud.fechaDeposito | date: 'dd/MM/yyyy'
              }}</ion-text>
            </h2>
          </ion-label>
        </ion-item>
      </ion-list>
      <div class="duplicado-panel " *ngIf="posibleDuplicado as duplicado">
        <ion-list>
          <ion-list-header color="warning">
            <ion-label class="ion-text-wrap">
              <h2 class="ion-text-uppercase">
                Posible duplicado con solicitud: {{ duplicado.folio }}
                <span class="ion-padding-start">
                  <ion-text
                    [color]="duplicado.status === 'AUTORIZADO' ? 'dangeg' : ''"
                  >
                    ({{ duplicado.status }})
                  </ion-text>
                </span>
              </h2>
            </ion-label>
          </ion-list-header>
          <ion-item color="warning">
            <ion-label>
              <h2>
                {{ duplicado.total | currency }}
                <strong class="ion-padding-start"
                  >({{ duplicado.fechaDeposito | date: 'dd/MM/yyyy' }})</strong
                >
              </h2>
              <h3>Banco: {{ duplicado.banco.nombre }}</h3>
              <h3>
                Cuenta: {{ duplicado.cuenta.descripcion }}({{
                  duplicado.cuenta.numero
                }})
              </h3>
              <p>
                {{ duplicado.cliente.nombre }}
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>
      <ion-button expand="full" (click)="autorizar()">
        <ion-icon name="checkmark-done" slot="start"></ion-icon>
        <ion-label>Autorizar</ion-label>
      </ion-button>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizarModalComponent implements OnInit {
  @Input() solicitud: Partial<SolicitudDeDeposito>;
  @Input() posibleDuplicado: Partial<SolicitudDeDeposito>;
  constructor(private modal: PopoverController) {}

  ngOnInit() {
    console.log('Posible: ', this.posibleDuplicado);
  }

  dismissModal() {
    this.modal.dismiss();
  }

  autorizar() {
    const autorizacion: Partial<Autorizacion> = {
      comentario: `${
        this.solicitud.transferencia > 0 ? 'TRANSFERENCIA' : 'DEPOSITO'
      }`,
    };
    this.modal.dismiss(autorizacion);
  }
}
