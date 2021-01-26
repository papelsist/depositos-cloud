import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Banco, CuentaDeBanco } from '@papx/models';
import { BANCOS } from './bancos';
import { CUENTAS } from './cuentas';

@Injectable({ providedIn: 'root' })
export class BancosService {
  private _bancos$ = new BehaviorSubject<Banco[]>(BANCOS);

  readonly bancos$ = this._bancos$.asObservable().pipe(
    map((bancos) =>
      bancos.sort((b1, b2) =>
        b1.nombre.toLowerCase().localeCompare(b2.nombre.toLowerCase())
      )
    ),
    shareReplay()
  );

  private _cuentas$ = new BehaviorSubject<CuentaDeBanco[]>(CUENTAS);

  readonly cuentas$ = this._cuentas$.asObservable().pipe(
    map((bancos) =>
      bancos.sort((b1, b2) =>
        b1.descripcion.toLowerCase().localeCompare(b2.descripcion.toLowerCase())
      )
    ),
    shareReplay()
  );

  constructor() {}
}
