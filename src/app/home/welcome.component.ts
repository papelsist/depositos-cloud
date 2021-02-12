import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'papx-welcome',
  template: `
    <ion-card>
      <img
        class="banner-img"
        src="https://firebasestorage.googleapis.com/v0/b/depositos-sx.appspot.com/o/mobil-apps-images%2Fpapelsa-75-splash-min.png?alt=media&token=499ec7c7-6bd3-4c39-882e-75c6f276e451"
      />
      <ion-card-header>
        <ion-card-title>SX-DEPOSITOS</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <ion-text color="medium">
          <h2>
            Bienvenido
            <ion-text color="primary">
              {{ displayName }}
            </ion-text>
            al sistema de registro y autorización de solicitudes de depósitos/
            transferencias bancarias.
          </h2>
        </ion-text>
      </ion-card-content>
    </ion-card>
    <div class="actions">
      <ion-button
        routerLink="/solicitudes"
        fill="clear"
        expand="full"
        color="secondary"
      >
        <ion-label>Solicitudes</ion-label>
        <ion-icon slot="start" name="list-circle-outline"></ion-icon>
      </ion-button>
      <ion-button
        routerLink="/autorizaciones"
        fill="clear"
        expand="full"
        color="tertiary"
      >
        <ion-label>Autorizaciones</ion-label>
        <ion-icon slot="start" name="shield-checkmark"></ion-icon>
      </ion-button>
    </div>
  `,
  styles: [
    `
      .actions {
        display: flex;
        justify-content: center;
      }
      .banner-img {
        max-width: 100%;
        max-height: 600px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  @Input() displayName = 'Falta Display name';
  @Input() lastAccess;
  constructor() {}

  ngOnInit() {}
}
