import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Sucursal } from '@papx/models';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  readonly sucursales: Sucursal[] = [
    {
      id: '402880fc5e4ec411015e4ec64ce5012d',
      clave: '10',
      nombre: 'CALLE 4',
      label: 'Calle 4',
    },
    {
      id: '402880fc5e4ec411015e4ec64e70012e',
      clave: '12',
      nombre: 'TACUBA',
      label: 'Tacuba',
    },
    {
      id: '402880fc5e4ec411015e4ec64f460130',
      clave: '5',
      nombre: 'BOLIVAR',
      label: 'Bolivar',
    },
    {
      id: '402880fc5e4ec411015e4ec64f8e0131',
      clave: '3',
      nombre: 'ANDRADE',
      label: 'Andrade',
    },
    {
      id: '402880fc5e4ec411015e4ec650760134',
      clave: '13',
      nombre: 'CF5FEBRERO',
      label: '5 Febrero',
    },
    {
      id: '402880fc5e4ec411015e4ec6512a0136',
      clave: '2',
      nombre: 'VERTIZ 176',
      label: 'Vertiz 176',
    },
  ];

  // sucursales$ = new BehaviorSubject(this._sucursales);

  constructor(
    private http: HttpClient,
    private fs: AngularFireStorage,
    private firestore: AngularFirestore
  ) {}
}
