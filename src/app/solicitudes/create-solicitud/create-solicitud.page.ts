import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  Cartera,
  carteraDisplayName,
  SolicitudDeDeposito,
  User,
} from '@papx/models';
import { SolicitudesService } from '@papx/data-access';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@papx/auth';
import { AlertController } from '@ionic/angular';
import { UserInfo } from '@papx/models';

@Component({
  selector: 'app-create-solicitud',
  templateUrl: './create-solicitud.page.html',
  styleUrls: ['./create-solicitud.page.scss'],
})
export class CreateSolicitudPage implements OnInit {
  cartera: Cartera = 'CON';
  form = new FormGroup({
    cliente: new FormControl(null, [Validators.required]),
  });
  session$ = this.auth.userInfo$;
  constructor(
    private service: SolicitudesService,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onSave(event: Partial<SolicitudDeDeposito>, session: UserInfo) {
    // console.log('Salvar solicitud: ', event);
    const { uid, displayName, email } = session;
    event.createUser = { uid, displayName, email };
    const sol = this.service.save(event);
    this.router.navigate(['solicitudes']);
  }

  async validarDuplicado(sol: Partial<SolicitudDeDeposito>) {
    const found = await this.service.buscarDuplicado(sol);
    if (found.length > 0) {
      const { sucursal, solicita, total } = found[0];
      const message = `Existe un depósito YA REGISTRADO con 
        los mismos datos (importe, banco, cuenta y fecha) 
        en la sucursal ${sucursal}. Registrado por: ${solicita}`;
      const alert = await this.alertController.create({
        header: 'Alerta',
        subHeader: `Posible deposito duplicado por`,
        message,
        buttons: ['OK'],
        cssClass: 'create-solicitud-custom-alert',
      });
      await alert.present();
    }
  }

  get carteraName() {
    return carteraDisplayName(this.cartera);
  }
}
