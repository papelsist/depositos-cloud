import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-rechazar-solicitud',
  template: `
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>
          Rechazar solicitud: {{ solicitud.folio || 'ND' }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-grid [formGroup]="form">
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Motivo</ion-label>
            <ion-select
              formControlName="motivo"
              placeholder="Seleccione el motivo"
            >
              <ion-select-option *ngFor="let m of motivos" [value]="m">
                <ion-text color="primary">
                  {{ m }}
                </ion-text>
              </ion-select-option>
            </ion-select>
          </ion-item>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-item>
            <ion-label position="floating">Comentario</ion-label>
            <ion-input
              formControlName="comentario"
              placeholder=""
              type="text"
            ></ion-input>
          </ion-item>
        </ion-col>
      </ion-row>
    </ion-grid>

    <div class="actions">
      <ion-button fill="clear" color="medium" (click)="close()">
        <ion-label>Cancelar </ion-label>
      </ion-button>
      <ion-button fill="clear" color="primary" (click)="submit()">
        <ion-label> Aceptar </ion-label>
      </ion-button>
    </div>
  `,
  styles: [
    `
      .actions {
        display: flex;
        justify-content: flex-end;
        ion-button:nth-child(0) {
          margin-left: auto;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RechazarModalComponent implements OnInit {
  form = new FormGroup({
    motivo: new FormControl('CHECAR_BANCO', Validators.required),
    comentario: new FormControl(null),
  });
  @Input() solicitud: SolicitudDeDeposito;
  @Input() motivos: string[] = [
    'CHECAR_BANCO',
    'CHECAR_CUENTA',
    'CHECAR_FECHA',
    'CHECAR_IMPORTE',
  ];

  constructor(private popover: PopoverController) {}

  ngOnInit() {}

  async close() {
    await this.popover.dismiss();
  }

  async submit() {
    await this.popover.dismiss(this.form.value);
  }
}
