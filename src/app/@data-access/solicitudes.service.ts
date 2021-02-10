import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';
import parseJSON from 'date-fns/parseJSON';
import isSameDay from 'date-fns/isSameDay';

import { SolicitudDeDeposito } from '../@models/solicitud-de-deposito';
import { Autorizacion, AutorizacionRechazo } from '../@models/autorizacion';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  pendientesPorAutorizar$ = this.afs
    .collection<SolicitudDeDeposito>('solicitudes', (ref) =>
      ref.where('status', '==', 'PENDIENTE')
    )
    .valueChanges({ idField: 'id' })
    .pipe(shareReplay());

  pendientesPorAutorizarCount$ = this.pendientesPorAutorizar$.pipe(
    map((data) => data.length),
    shareReplay()
  );

  autorizadas$ = this.afs
    .collection<SolicitudDeDeposito>('solicitudes', (ref) =>
      ref.where('status', '==', 'AUTORIZADO').limit(200)
    )
    .snapshotChanges()
    .pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          const res: SolicitudDeDeposito = { id, ...data };
          return res;
        })
      ),
      shareReplay()
    );
  // .valueChanges({ idField: 'id' })
  // .pipe(shareReplay());

  autorizadasCount$ = this.autorizadas$.pipe(
    map((data) => data.length),
    shareReplay()
  );

  rechazadas$ = this.afs
    .collection<SolicitudDeDeposito>('solicitudes', (ref) =>
      ref.where('status', '==', 'RECHAZADO').limit(200)
    )
    .valueChanges({ idField: 'id' })
    .pipe(shareReplay());

  rechazadasCount$ = this.rechazadas$.pipe(map((data) => data.length));

  constructor(
    private httpClient: HttpClient,
    private readonly afs: AngularFirestore
  ) {}

  async save(solicitud: Partial<SolicitudDeDeposito>) {
    const sol = await this.afs
      .collection<Partial<SolicitudDeDeposito>>('solicitudes')
      .add(solicitud);
    if (!sol) {
      throw Error(`Error salvando solicitud en firebase`);
    }
    return sol;
  }

  findAllPendientes(): Observable<SolicitudDeDeposito[]> {
    return this.afs
      .collection<SolicitudDeDeposito>('solicitudes')
      .valueChanges({ idField: 'id' })
      .pipe(catchError((err) => throwError(err)));
  }

  findPendientesPorSucursal(
    sucursal: string,
    max: number = 100
  ): Observable<SolicitudDeDeposito[]> {
    return this.afs
      .collection<SolicitudDeDeposito>('solicitudes', (ref) => {
        let query = ref.where('sucursal', '==', sucursal);
        return query.limit(max);
      })
      .valueChanges({ idField: 'id' })
      .pipe(catchError((err) => throwError(err)));
  }

  findPendientesPorAutorizar(): Observable<SolicitudDeDeposito[]> {
    return this.afs
      .collection<SolicitudDeDeposito>('solicitudes', (ref) =>
        ref.where('status', '==', 'PENDIENTE')
      )
      .valueChanges({ idField: 'id' });
  }

  get(id: string) {
    const doc = this.afs.doc<SolicitudDeDeposito>(`solicitudes/${id}`);
    return doc.valueChanges();
  }

  async autorizar(id: string, autorizacion: Autorizacion) {
    const doc = this.afs.doc(`solicitudes/${id}`);
    await doc.update({
      autorizacion,
      status: 'AUTORIZADO',
      lastUpdated: firebase.firestore.Timestamp.now(),
    });
    console.log('Autorización exitosa');
  }

  async rechazar(id: string, rechazo: AutorizacionRechazo) {
    const doc = this.afs.doc(`solicitudes/${id}`);
    await doc.update({
      rechazo,
      status: 'RECHAZADO',
      lastUpdated: firebase.firestore.Timestamp.now(),
    });
  }

  buscarDuplicado(sol: Partial<SolicitudDeDeposito>) {
    const { total, cuenta, banco } = sol;
    const fechaDeposito = parseJSON(sol.fechaDeposito);
    return this.afs
      .collection<SolicitudDeDeposito>('solicitudes', (ref) =>
        ref
          .where('total', '==', total)
          .where('cuenta.id', '==', cuenta.id)
          .where('banco.id', '==', banco.id)
          .limit(100)
      )
      .valueChanges()
      .pipe(
        take(1),
        map((rows) =>
          rows.filter((item) => {
            const fdep = parseJSON(item.fechaDeposito);
            return isSameDay(fechaDeposito, fdep);
          })
        ),
        catchError((err) => throwError(err))
      )
      .toPromise();
  }
}
