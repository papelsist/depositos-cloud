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

import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'papelx-cliente-selector',
  templateUrl: './cliente-selector.component.html',
  styleUrls: ['./cliente-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteSelectorComponent implements OnInit {
  filter$ = new BehaviorSubject('');
  clientes$: Observable<Partial<Cliente>[]>;

  constructor(
    private modalCtrl: ModalController,
    private service: ClientesService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.clientes$ = from([]);
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
}
