import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { ClienteDto, Cliente } from '@papx/models';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private clientesUrl = 'assets/data/clientes-credito.json';

  clientesCredito$: Observable<Partial<Cliente>[]> = this.http
    .get<Partial<Cliente>[]>(this.clientesUrl)
    .pipe(
      shareReplay(),
      catchError((error: any) => throwError(error))
    );

  // repository$: Observable<{ [key: string]: ClienteDto }> = this.clientes$.pipe(
  //   map((cliente) => keyBy(cliente, 'id'))
  // );

  constructor(private http: HttpClient) {}

  // findById(id: string): Observable<Cliente> {
  //   return this.repository$.pipe(map((directory) => directory[id]));
  // }
}
