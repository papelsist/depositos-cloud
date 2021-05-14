import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import firebase from 'firebase/app';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, take } from 'rxjs/operators';

import { isSameDay, parseJSON, parseISO, startOfDay, endOfDay } from 'date-fns';
import toNumber from 'lodash-es/toNumber';

import {
  SolicitudDeDeposito,
  UpdateSolicitud,
} from '../@models/solicitud-de-deposito';
import { Autorizacion, AutorizacionRechazo } from '../@models/autorizacion';
import { PeriodoSearchCriteria, User } from '@papx/models';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  readonly COLLECTION = 'solicitudes';

  pendientesPorAutorizar$ = this.afs
    .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) =>
      ref
        .where('status', '==', 'PENDIENTE')
        .where('appVersion', '==', 2)
        .limit(100)
    )
    .valueChanges({ idField: 'id' })
    .pipe(shareReplay());

  pendientesPorAutorizarCount$ = this.pendientesPorAutorizar$.pipe(
    map((data) => data.length),
    shareReplay()
  );

  autorizadas$ = this.afs
    .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) =>
      ref
        .where('status', '==', 'AUTORIZADO')
        .orderBy('autorizacion.fecha', 'desc')
        .limit(20)
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
      )
      // shareReplay()
    );
  // .valueChanges({ idField: 'id' })
  // .pipe(shareReplay());

  autorizadasCount$ = this.autorizadas$.pipe(
    map((data) => data.length),
    shareReplay()
  );

  rechazadas$ = this.afs
    .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) =>
      ref
        .where('status', '==', 'RECHAZADO')
        .where('appVersion', '==', 2)
        .limit(50)
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
    const { uid, displayName } = user;
    try {
      const payload: Partial<SolicitudDeDeposito> = {
        ...solicitud,
        fecha: new Date().toISOString(),
        createUser: displayName,
        createUserUid: uid,
        updateUser: displayName,
        updateUserUid: uid,
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        appVersion: 2,
      };
      const folioRef = this.afs.doc('folios/solicitudes').ref;
      let folio = 1;

      const solicitudRef = this.afs.collection(this.COLLECTION).doc().ref;

      return this.afs.firestore.runTransaction(async (transaction) => {
        const folioDoc = await transaction.get<any>(folioRef);
        const SUCURSAL = solicitud['sucursal'];
        const folios = folioDoc.data() || {};
        if (!folios[SUCURSAL]) {
          folios[SUCURSAL] = 0;
        }
        folios[SUCURSAL] += 1;
        folio = folios[SUCURSAL];

        transaction
          .set(folioRef, folios, { merge: true })
          .set(solicitudRef, { ...payload, folio });
        return folio;
      });
    } catch (error: any) {
      console.error('Error salvando pedido: ', error);
      throw new Error('Error salvando pedido: ' + error.message);
    }
  }

  async update(command: UpdateSolicitud, user: User) {
    const { uid, displayName } = user;
    try {
      const doc = this.afs.doc(`${this.COLLECTION}/${command.id}`);
      const data: Partial<SolicitudDeDeposito> = {
        ...command.changes,
        updateUser: displayName,
        updateUserUid: uid,
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
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
    max: number = 30
  ): Observable<SolicitudDeDeposito[]> {
    return this.findPorSucursal(sucursal, 'PENDIENTE', max);
  }

  findPorSucursal(
    sucursal: string,
    status: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO' | 'ATENDIDO',
    max: number = 30
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

  findAutorizadas(
    sucursal: string,
    criteria: PeriodoSearchCriteria
  ): Observable<SolicitudDeDeposito[]> {
    const { fechaInicial, fechaFinal, registros } = criteria;
    const inicial = startOfDay(parseJSON(criteria.fechaInicial));
    const final = endOfDay(parseJSON(criteria.fechaFinal));
    console.log(
      'Fecha inicial JSON: ',
      startOfDay(parseJSON(criteria.fechaInicial))
    );
    console.log('Fecha inicial ISO: ', parseISO(criteria.fechaInicial));
    return this.afs
      .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) => {
        let query = ref
          .where('autorizacion.fecha', '>=', inicial)
          .where('autorizacion.fecha', '<=', final)
          .where('sucursal', '==', sucursal);
        return query.limit(registros);
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
    autorizacion.replicado = null;

    await doc.update({
      autorizacion,
      status: 'AUTORIZADO',
      lastUpdated: new Date().toISOString(),
      cerrado: true,
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
      lastUpdated: new Date().toISOString(),
    });
  }

  buscarDuplicado(sol: Partial<SolicitudDeDeposito>) {
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

  buscarAutorizadas(filtro: any) {
    return this.afs
      .collection<SolicitudDeDeposito>(this.COLLECTION, (ref) => {
        let query = ref.where('status', '==', 'AUTORIZADO');
        // .where('sucursal', '==', 'OFICINAS');
        if (filtro.importeInicial) {
          query = query.where('total', '>=', toNumber(filtro.importeInicial));
        }
        if (filtro.importeFinal) {
          query = query.where('total', '<=', toNumber(filtro.importeFinal));
        }
        return query.limit(10);
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            const res: SolicitudDeDeposito = { id, ...data };
            return res;
          })
        )
      );
  }
}
