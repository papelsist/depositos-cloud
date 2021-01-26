import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Cartera, carteraDisplayName, SolicitudDeDeposito } from '@papx/models';

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

  constructor() {}

  ngOnInit() {}

  onSave(event: Partial<SolicitudDeDeposito>) {
    console.log('Salvar solicitud: ', event);
  }

  get carteraName() {
    return carteraDisplayName(this.cartera);
  }
}
