import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  Autorizacion,
  AutorizacionRechazo,
  SolicitudDeDeposito,
  TipoDeAutorizacion,
} from '@papx/models';

@Component({
  selector: 'papx-autorizar-deposito-modal',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title
          >Autorizar
          {{
            solicitud.transferencia > 0.0 ? 'Transferencia' : 'Depósito'
          }}</ion-title
        >
        <ion-buttons slot="end">
          <ion-button (click)="dismissModal()">Cancelar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" class="ion-text-center">
            <ion-text color="success">
              <h2>
                {{ solicitud.total | currency }}
              </h2>
            </ion-text>
          </ion-col>
          <ion-col size="12" class="ion-text-start">
            <h3 class="row">
              <span>Banco origen:</span>
              <span>{{ solicitud.banco.nombre }}</span>
            </h3>
          </ion-col>
          <ion-col size="12" class="ion-text-start">
            <h3 class="row">
              <span>Cuenta destino: </span>
              <span
                >{{ solicitud.cuenta.descripcion }} ({{
                  solicitud.cuenta.numero
                }})</span
              >
            </h3>
          </ion-col>

          <ion-col size="12" class="ion-text-start">
            <h3 class="row">
              <span>Fecha depósito: </span>
              <span>{{ solicitud.fechaDeposito | date: 'dd/MM/yyyy' }}</span>
            </h3>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer>
      <ion-button expand="block" (click)="autorizar()">
        <ion-icon name="checkmark-done" slot="start"></ion-icon>
        <ion-label>Autorizar</ion-label>
      </ion-button>
      <ion-button expand="block" (click)="rechazar()" color="danger">
        <ion-icon name="arrow-undo" slot="start"></ion-icon>
        <ion-label>Rechazar</ion-label>
      </ion-button>
    </ion-footer>
  `,
  styles: [
    `
      .row {
        display: flex;
        gap: 10px;
        justify-content: space-between;
        align-items: center;
        span {
          border: 1px solid red;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizarModalComponent implements OnInit {
  @Input() solicitud: Partial<SolicitudDeDeposito>;
  constructor(private modal: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modal.dismiss();
  }

  autorizar() {
    const autorizacion: Autorizacion = {
      user: 'PENDIENTe',
      fecha: new Date().toISOString(),
      tipo: 'TRANSACCION_BANCARIA',
      autorizo: 'PORTAL BANCARIO',
      comentario: `${
        this.solicitud.transferencia > 0 ? 'TRANSFERENCIA' : 'DEPOSITO'
      }`,
    };
    this.modal.dismiss({ tipo: 'ACCEPT', autorizacion });
  }

  rechazar() {
    const rechazo: AutorizacionRechazo = {
      user: 'PENDIENT',
      fecha: new Date().toISOString(),
      tipo: 'TRANSACCION_BANCARIA',
      motivo: 'FALTAN DATOS',
      comentario: `PRUEBA DE RECHAZO`,
    };
    this.modal.dismiss({ tipo: 'REJECT', rechazo });
  }
}
