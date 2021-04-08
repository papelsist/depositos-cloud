import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';

import { Cliente, ClienteDto } from '@papx/models';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  clientesCredito$ = this.fetchClientesCredito().pipe(
    shareReplay(),
    catchError((error: any) => throwError(error))
  );

  clientesCache$ = this.fetchClientesCache().pipe(shareReplay());

  // repository$: Observable<{ [key: string]: ClienteDto }> = this.clientes$.pipe(
  //   map((cliente) => keyBy(cliente, 'id'))
  // );

  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private fs: AngularFireStorage
  ) {}

  // findById(id: string): Observable<Cliente> {
  //   return this.repository$.pipe(map((directory) => directory[id]));
  // }

  fetchClientesCache(): Observable<ClienteDto[]> {
    const ref = this.fs.ref('catalogos/ctes-all.json');
    return ref.getDownloadURL().pipe(
      switchMap((url) =>
        this.http.get<any[]>(url).pipe(
          map((rows) =>
            rows.map((i) => {
              const res: ClienteDto = {
                id: i.i,
                nombre: i.n,
                rfc: i.r,
                clave: i.cv,
                credito: !!i.cr,
              };
              return res;
            })
          ),
          catchError((err) =>
            throwError('Error descargando clientes ', err.message)
          )
        )
      )
    );
  }

  fetchClientesCredito(): Observable<Partial<Cliente>[]> {
    return this.fs
      .ref('catalogos/ctes-cre.json')
      .getDownloadURL()
      .pipe(
        switchMap((url) => this.http.get<Cliente[]>(url)),
        catchError((err) =>
          throwError('Error descargando clientes de credito ' + err.message)
        )
      );
  }

  /**
   * .collection('clientes')
      .where('nombre', '>=', 'PAPELSA')
      .orderBy('nombre', 'asc')
   * @param term
   */
  searchClientes(term: string, limit = 5) {
    return combineLatest([
      this.serachByRfc(term, limit),
      this.searchByNombre(term),
    ]).pipe(map(([b1, b2]) => [...b1, ...b2]));
  }

  searchByNombre(term: string, limit = 5) {
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref
          .where('nombre', '>=', term.toUpperCase())
          .orderBy('nombre', 'asc')
          .limit(limit)
      )
      .valueChanges()
      .pipe(take(1));
  }

  serachByRfc(rfc: string, limit = 1) {
    // PBA0511077F9;
    return this.afs
      .collection<Cliente>('clientes', (ref) =>
        ref.where('rfc', '==', rfc.toUpperCase()).limit(limit)
      )
      .valueChanges()
      .pipe(take(1));
  }

  findById(id: string) {
    return this.afs
      .doc<Cliente>(`clientes/${id}`)
      .valueChanges()
      .pipe(
        take(1),
        catchError((err) =>
          throwError('Error fetching cliente from firestore ' + err.message)
        )
      );
  }
}
