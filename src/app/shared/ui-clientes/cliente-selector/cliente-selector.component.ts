import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Cliente } from '@papx/models';
import { ClientesService } from '@papx/data-access';

import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  filter as xfilter,
  switchMap,
  catchError,
} from 'rxjs/operators';

@Component({
  selector: 'papelx-cliente-selector',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteSelectorComponent implements OnInit {
  filter$ = new BehaviorSubject('');
  // clientes$: Observable<Partial<Cliente>[]>;
  clientes$;

  constructor(
    private modalCtrl: ModalController,
    private service: ClientesService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.clientes$ = this.filter$.pipe(
      map((term) => term.toUpperCase()),
      debounceTime(100),
      distinctUntilChanged(),
      xfilter((term) => term.length > 2),
      switchMap((term) => this.lookUp(term)),
      catchError((err) => this.handleError(err))
    );
  }

  lookUp(value: string) {
    return this.service.clientesCache$.pipe(
      map((rows) =>
        rows.filter((item) => {
          return item.nombre.toLowerCase().includes(value.toLowerCase());
        })
      )
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  select(c: Partial<Cliente>) {
    this.modalCtrl.dismiss(c);
  }

  onSearch({ target: { value } }) {
    this.filter$.next(value);
  }

  onSearAll(term: string) {
    this.clientes$ = this.service.searchClientes(term, 5);
  }

  handleError(err: any) {
    console.error('Error buscando clientes, ', err);
    return of([]);
  }
}
