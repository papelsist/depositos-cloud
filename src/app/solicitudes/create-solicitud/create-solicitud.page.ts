import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {
  Cartera,
  carteraDisplayName,
  SolicitudDeDeposito,
  User,
} from '@papx/models';
import { SolicitudesService } from '@papx/data-access';
import { AuthService } from '@papx/auth';

@Component({
  selector: 'app-create-solicitud',
  templateUrl: './create-solicitud.page.html',
  styleUrls: ['./create-solicitud.page.scss'],
})
export class CreateSolicitudPage implements OnInit {
  cartera: Cartera = 'CON';
  modificarCartera = false;

  vm$ = combineLatest([this.auth.userInfo$, this.auth.claims$]).pipe(
    map(([user, claims]) => ({
      user,
      claims,
      sucursal: user.sucursal || 'FALTA_SUCURSAL',
      creditoUser: !!claims.xpapCxcUser,
      cartera: user.sucursal === 'OFICINAS' ? 'CRE' : 'CON',
    }))
  );

  constructor(
    private service: SolicitudesService,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.vm$.pipe(take(1)).subscribe((vm) => {
      this.modificarCartera = !!vm.claims.xpapDepositosCredito;
      this.cartera = vm.cartera as Cartera;
    });
  }

  async onSave(sol: Partial<SolicitudDeDeposito>, user: User) {
    try {
      sol.tipo = this.cartera;
      const fol = await this.service.createSolicitud(sol, user);
      this.router.navigate(['solicitudes']);
    } catch (error) {
      this.handleError(error.message);
    }
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

  async handleError(message: string) {
    const al = await this.alertController.create({
      header: 'Error salvando datos',
      subHeader: 'Firebase',
      message,
      mode: 'ios',
      animated: true,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await al.present();
  }
}
