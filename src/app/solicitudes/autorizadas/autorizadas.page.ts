import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';
import { SolicitudesService } from '@papx/data-access';
import {
  buildPeriodoCriteria,
  PeriodoSearchCriteria,
  SolicitudDeDeposito,
  UserInfo,
} from '@papx/models';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
  map,
  shareReplay,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { BaseComponent } from 'src/app/core';

@Component({
  selector: 'app-autorizadas',
  templateUrl: './autorizadas.page.html',
  styleUrls: ['./autorizadas.page.scss'],
})
export class AutorizadasPage extends BaseComponent implements OnInit {
  criteria$ = new BehaviorSubject<PeriodoSearchCriteria>(
    buildPeriodoCriteria(3, 3)
  );

  solicitudes$ = combineLatest([this.criteria$, this.auth.userInfo$]).pipe(
    map(([criteria, user]) => ({ criteria, sucursal: user.sucursal })),
    switchMap(({ criteria, sucursal }) =>
      this.service.findAutorizadas(sucursal, criteria)
    ),
    shareReplay(1)
  );

  private _filtrar = new BehaviorSubject<boolean>(true);
  filtrar$ = this._filtrar.asObservable().pipe(shareReplay());

  constructor(private service: SolicitudesService, private auth: AuthService) {
    super();
  }

  ngOnInit() {}

  filtrar(value: boolean) {
    this._filtrar.next(!value);
  }

  onSearch(event: string) {
    console.log('Filter by: ', event);
  }

  changeCriteria(event: PeriodoSearchCriteria) {
    this.criteria$.next(event);
  }
}
