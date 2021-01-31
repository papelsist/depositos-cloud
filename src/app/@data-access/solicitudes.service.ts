import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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

  findPendientes(): Observable<SolicitudDeDeposito[]> {
    return this.afs
      .collection<SolicitudDeDeposito>('solicitudes')
      .valueChanges({ idField: 'id' });
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
}
