import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import firebase from 'firebase/app';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';
import parseJSON from 'date-fns/parseJSON';
import isSameDay from 'date-fns/isSameDay';

import {
  SolicitudDeDeposito,
  UpdateSolicitud,
} from '../@models/solicitud-de-deposito';
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
    private readonly afs: AngularFirestore,
    private readonly fns: AngularFireFunctions
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

  async update(command: UpdateSolicitud) {
    try {
      const doc = this.afs.doc(`solicitudes/${command.id}`);
      const data = {
        ...command.changes,
        lastUpdated: firebase.firestore.Timestamp.now(),
      };
      await doc.ref.update(data);
    } catch (error) {
      throw new Error('Error actualizando solicitud :' + error.message);
    }
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
    return this.findPorSucursal(sucursal, 'PENDIENTE', max);
  }

  findPorSucursal(
    sucursal: string,
    status: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO' | 'ATENDIDO',
    max: number = 100
  ): Observable<SolicitudDeDeposito[]> {
    console.log('Buscando solicitudes: ', status, sucursal);
    return this.afs
      .collection<SolicitudDeDeposito>('solicitudes', (ref) => {
        let query = ref
          .where('sucursal', '==', sucursal)
          .where('status', '==', status);
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
    return doc
      .valueChanges({ idField: 'id' })
      .pipe(catchError((err) => throwError(err)));
  }

  async autorizar(
    id: string,
    autorizacion: Autorizacion,
    posibleDuplicadoId?: string
  ) {
    const doc = this.afs.doc(`solicitudes/${id}`);
    await doc.update({
      autorizacion,
      status: 'AUTORIZADO',
      lastUpdated: firebase.firestore.Timestamp.now(),
      posibleDuplicadoId,
    });
    console.log('Autorización exitosa');
  }

  async rechazar(id: string, command: Partial<AutorizacionRechazo>) {
    console.log('RECHAZO: ', command);
    const rechazo = {
      ...command,
      tipo: 'TRANSACCION_BANCARIA',
      solicitud: id,
      fecha: new Date().toISOString(),
    };

    const callable = this.fns.httpsCallable('rechazarSolicitud');
    return callable(rechazo)
      .pipe(catchError((err) => throwError(err)))
      .toPromise()
      .catch((error) => Promise.reject(error));
    // const doc = this.afs.doc(`solicitudes/${id}`);
    // await doc.update({
    //   rechazo,
    //   status: 'RECHAZADO',
    //   lastUpdated: firebase.firestore.Timestamp.now(),
    // });
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
          // .where('id', '!=', id)
          .limit(10)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        take(1),
        map((rows) => rows.filter((item) => item.id !== sol.id)),
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
