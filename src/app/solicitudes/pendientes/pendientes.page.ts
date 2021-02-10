import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { BehaviorSubject, Observable, timer, combineLatest } from 'rxjs';
import { filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { SolicitudesService } from '@papx/data-access';
import { SolicitudDeDeposito, UserInfo } from '@papx/models';
import { BaseComponent } from 'src/app/core';
import { SolicitudCardComponent } from '@papx/shared/ui-solicitudes/solicitud-card/solicitud-card.component';
import { AuthService } from '@papx/auth';

@Component({
  selector: 'papx-solicitudes-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage extends BaseComponent implements OnInit {
  pendientes$: Observable<SolicitudDeDeposito[]>;
  _pauseResume$ = new BehaviorSubject<boolean>(true);
  @ViewChildren(SolicitudCardComponent)
  elements: QueryList<SolicitudCardComponent>;

  timer$ = timer(1000, 3000).pipe(
    withLatestFrom(this._pauseResume$),
    takeUntil(this.destroy$),
    filter(([time, val]) => val),
    tap(([time, val]) => this.refreshRetraso(time))
  );
  STORAGE_KEY = 'sx-depositos-pwa.solicitudes.pendientes';

  config: { view: 'cards' | 'list'; filtrar: string } = this.loadConfig();

  filtrarPropias = false;
  filtrar$ = new BehaviorSubject<boolean>(this.config.filtrar === 'true');

  user: UserInfo;

  filtroBtnColor$: Observable<string> = this.filtrar$.pipe(
    map((value) => (value ? 'primary' : ''))
  );

  constructor(
    private service: SolicitudesService,
    private authService: AuthService
  ) {
    super();
  }

  private loadConfig(): any {
    const sjson = localStorage.getItem(this.STORAGE_KEY);
    return sjson ? JSON.parse(sjson) : { view: 'cards', filtrar: 'false' };
  }

  private saveConfig() {
    const sjson = JSON.stringify(this.config);
    localStorage.setItem(this.STORAGE_KEY, sjson);
  }

  ngOnInit() {
    this.authService.userInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
        const { sucursal, uid } = user;
        this.loadPendientes(sucursal, uid);
      });

    this.timer$.subscribe(
      () => {},
      () => {},
      () => console.log('COMPLETE PULLING')
    );
  }

  changeView(view: 'list' | 'cards') {
    this.config = { ...this.config, view };
    this.saveConfig();
  }

  private loadPendientes(sucursal: string, uid: string) {
    this.pendientes$ = combineLatest([
      this.filtrar$,
      this.service.findPendientesPorSucursal(sucursal),
    ]).pipe(
      map(([filtrar, sols]) =>
        filtrar ? sols.filter((item) => item.createUser.uid === uid) : sols
      )
    );
  }

  private refreshRetraso(time: number) {
    // console.log('REFRESH RETRASOS: ', time);
    this.elements.forEach((item) => item.updateRetraso());
  }

  /**
   * Start refreshing retraso
   */
  ionViewDidEnter() {
    this._pauseResume$.next(true);
  }
  /**
   * Stop refreshing retraso
   */
  ionViewDidLeave() {
    this._pauseResume$.next(false);
  }

  filtrar() {
    this.filtrarPropias = !this.filtrarPropias;
    this.filtrar$.next(this.filtrarPropias);
    this.config.filtrar = this.filtrarPropias.toString();
    this.saveConfig();
  }

  onSelection(sol: SolicitudDeDeposito) {
    console.log('Detail of: ', sol);
  }
}
