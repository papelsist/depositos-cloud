import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Cartera, carteraDisplayName, SolicitudDeDeposito } from '@papx/models';
import { SolicitudesService } from '@papx/data-access';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-solicitud',
  templateUrl: './create-solicitud.page.html',
  styleUrls: ['./create-solicitud.page.scss'],
})
export class CreateSolicitudPage implements OnInit {
  @Input() cartera: Cartera = 'CON';
  form = new FormGroup({
    cliente: new FormControl(null, [Validators.required]),
  });

  constructor(private service: SolicitudesService, private router: Router) {}

  ngOnInit() {}

  async onSave(event: Partial<SolicitudDeDeposito>) {
    console.log('Salvar solicitud: ', event);
    const sol = this.service.save(event);
    this.router.navigate(['solicitudes']);
  }

  get carteraName() {
    return carteraDisplayName(this.cartera);
  }
}
