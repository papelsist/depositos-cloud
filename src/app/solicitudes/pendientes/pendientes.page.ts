import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { BehaviorSubject, Observable, timer, combineLatest, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { SolicitudesService, NotificationsService } from '@papx/data-access';
import { SolicitudDeDeposito, User, UserInfo } from '@papx/models';
import { SolicitudCardComponent } from '@papx/shared/ui-solicitudes/solicitud-card/solicitud-card.component';
import { AuthService } from '@papx/auth';

import { BaseComponent } from 'src/app/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'papx-solicitudes-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage extends BaseComponent implements OnInit {
  STORAGE_KEY = 'sx-depositos-pwa.solicitudes.pendientes';

  _pauseResume$ = new BehaviorSubject<boolean>(true);
  @ViewChildren(SolicitudCardComponent)
  elements: QueryList<SolicitudCardComponent>;

  timer$ = timer(1000, 3000).pipe(
    withLatestFrom(this._pauseResume$),
    takeUntil(this.destroy$),
    filter(([time, val]) => val),
    tap(([time, val]) => this.refreshRetraso(time))
  );

  config: { view: 'cards' | 'list'; filtrar: string } = this.loadConfig();

  filtrar$ = new BehaviorSubject<boolean>(this.config.filtrar === 'true');

  pendientes$ = combineLatest([this.filtrar$, this.authService.userInfo$]).pipe(
    switchMap(([filtrar, user]) =>
      filtrar
        ? this.service.findPendientesByUser(user.uid)
        : this.service.findPendientesBySucursal(user.sucursal)
    ),
    map((rows) =>
      rows.sort((a, b) =>
        a.folio > b.folio ? 1 : a.folio === b.folio ? 0 : -1
      )
    )
  );

  filtroBtnColor$: Observable<string> = this.filtrar$.pipe(
    map((value) => (value ? 'primary' : ''))
  );

  vm$ = combineLatest([
    this.filtrar$,
    this.pendientes$,
    this.filtroBtnColor$,
    this.authService.userInfo$,
    this.notificationsService.token$,
  ]).pipe(
    map(([filtrar, pendientes, filtroColor, user, token]) => ({
      filtrar,
      pendientes,
      filtroColor,
      user,
      sucursal: user.sucursal,
      token,
    }))
  );

  constructor(
    private service: SolicitudesService,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private alertController: AlertController
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

  filtrar(value: boolean) {
    this.filtrar$.next(!value);
    this.config.filtrar = (!value).toString();
    this.saveConfig();
  }

  onSelection(sol: SolicitudDeDeposito) {
    console.log('Detail of: ', sol);
  }

  async registrarNotificaciones(user: UserInfo, token?: string) {
    // console.log('Registrando notificaciones...', user, token);
    if (token) {
      const alert = await this.alertController.create({
        header: 'Subscripción a notificaciones',
        message:
          'Este equipo ya está registrado para recibir notificaciones, desea actualizarlo?',
        animated: true,
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Aceptar',
            role: 'accept',
            handler: async () => {
              await this.notificationsService.enableNotifications(user, {});
            },
          },
        ],
      });
      await alert.present();
    } else {
      // this.notificationsService.enableNotifications(user, {});
    }
  }
}
