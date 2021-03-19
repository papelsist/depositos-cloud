import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import firebase from 'firebase/app';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';

import { isSameDay, parseJSON } from 'date-fns';

import {
  SolicitudDeDeposito,
  UpdateSolicitud,
} from '../@models/solicitud-de-deposito';
import { Autorizacion, AutorizacionRechazo } from '../@models/autorizacion';
import { User } from '@papx/models';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  readonly COLLECTION = 'solicitudes';

  pendientesPorAutorizar$ = this.afs
    .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) =>
      ref.where('status', '==', 'PENDIENTE').where('sucursal', '==', 'OFICINAS')
    )
    .valueChanges({ idField: 'id' })
    .pipe(shareReplay());

  pendientesPorAutorizarCount$ = this.pendientesPorAutorizar$.pipe(
    map((data) => data.length),
    shareReplay()
  );

  autorizadas$ = this.afs
    .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) =>
      ref.where('status', '==', 'AUTORIZADO').limit(20)
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
    .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) =>
      ref.where('status', '==', 'RECHAZADO').limit(20)
    )
    .valueChanges({ idField: 'id' })
    .pipe(shareReplay());

  rechazadasCount$ = this.rechazadas$.pipe(map((data) => data.length));

  constructor(
    private httpClient: HttpClient,
    private readonly afs: AngularFirestore,
    private readonly fns: AngularFireFunctions
  ) {}

  async createSolicitud(solicitud: Partial<SolicitudDeDeposito>, user: User) {
    try {
      const payload = {
        ...solicitud,
        fecha: new Date().toISOString(),
        uid: user.uid,
        createUser: user.displayName,
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        appVersion: 2,
      };

      const folioRef = this.afs.doc('folios/solicitudes').ref;
      let folio = 1;

      const solicitudRef = this.afs.collection(this.COLLECTION).doc().ref;

      // Stats Data
      const statsRef = this.afs.collection(this.COLLECTION).doc('--stats--')
        .ref;

      return this.afs.firestore.runTransaction(async (transaction) => {
        const folioDoc = await transaction.get<any>(folioRef);
        const SUCURSAL = solicitud['sucursal'];
        const folios = folioDoc.data() || {};
        if (!folios[SUCURSAL]) {
          folios[SUCURSAL] = 0;
        }
        folios[SUCURSAL] += 1;
        folio = folios[SUCURSAL];

        const acumulados: { [key: string]: any } = {};
        acumulados[SUCURSAL] = {
          pendientes: {
            count: firebase.firestore.FieldValue.increment(1),
            total: firebase.firestore.FieldValue.increment(solicitud.total),
          },
        };

        transaction
          .set(folioRef, folios, { merge: true })
          .set(solicitudRef, { ...payload, folio })
          .set(statsRef, acumulados, { merge: true });
        return folio;
      });
    } catch (error: any) {
      console.error('Error salvando pedido: ', error);
      throw new Error('Error salvando pedido: ' + error.message);
    }
  }

  async update(command: UpdateSolicitud) {
    try {
      const doc = this.afs.doc(`${this.COLLECTION}/${command.id}`);
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
      .collection<SolicitudDeDeposito>(this.COLLECTION)
      .valueChanges({ idField: 'id' })
      .pipe(catchError((err) => throwError(err)));
  }

  findPendientesByUser(uid: string) {
    return this.afs
      .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) => {
        let query = ref
          .where('uid', '==', uid)
          .where('status', '==', 'PENDIENTE');
        return query.limit(20);
      })
      .valueChanges({ idField: 'id' })
      .pipe(catchError((err) => throwError(err)));
  }

  findPendientesBySucursal(
    sucursal: string,
    max: number = 20
  ): Observable<SolicitudDeDeposito[]> {
    console.log('Fetching pendientes Sucursal:', sucursal);
    return this.findPorSucursal(sucursal, 'PENDIENTE', max);
  }

  findPorSucursal(
    sucursal: string,
    status: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO' | 'ATENDIDO',
    max: number = 20
  ): Observable<SolicitudDeDeposito[]> {
    return this.afs
      .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) => {
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
      .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) =>
        ref.where('status', '==', 'PENDIENTE')
      )
      .valueChanges({ idField: 'id' });
  }

  get(id: string) {
    const doc = this.afs.doc<SolicitudDeDeposito>(`${this.COLLECTION}/${id}`);
    return doc
      .valueChanges({ idField: 'id' })
      .pipe(catchError((err) => throwError(err)));
  }

  async autorizar(
    id: string,
    autorizacion: Autorizacion,
    posibleDuplicadoId?: string
  ) {
    const doc = this.afs.doc(`${this.COLLECTION}/${id}`);
    autorizacion.fecha = firebase.firestore.Timestamp.now();

    await doc.update({
      autorizacion,
      status: 'AUTORIZADO',
      lastUpdated: firebase.firestore.Timestamp.now(),
      posibleDuplicadoId,
    });
    console.log('Autorización exitosa');
  }

  async rechazar(id: string, rechazo: Partial<AutorizacionRechazo>) {
    rechazo.dateCreated = firebase.firestore.Timestamp.now();
    rechazo.replicado = null;
    const doc = this.afs.doc(`${this.COLLECTION}/${id}`);
    await doc.update({
      rechazo,
      status: 'RECHAZADO',
      // lastUpdated: firebase.firestore.Timestamp.now(),
    });
  }

  buscarDuplicado(sol: Partial<SolicitudDeDeposito>) {
    console.log('Buscando  duplicado para: ', sol);
    const { total, cuenta, banco } = sol;
    const fechaDeposito = parseJSON(sol.fechaDeposito);
    return this.afs
      .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) =>
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
