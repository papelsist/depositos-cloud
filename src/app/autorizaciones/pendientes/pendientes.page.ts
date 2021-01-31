import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { BehaviorSubject, Observable, timer } from 'rxjs';
import { filter, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { SolicitudesService } from '@papx/data-access';
import { SolicitudDeDeposito } from '@papx/models';
import { BaseComponent } from 'src/app/core';
import { SolicitudCardComponent } from '@papx/shared/ui-solicitudes/solicitud-card/solicitud-card.component';
import { ModalController } from '@ionic/angular';
import { AutorizarModalComponent } from './autorizar-modal/autorizar-modal.component';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage extends BaseComponent implements OnInit {
  pendientes$: Observable<SolicitudDeDeposito[]>;
  _pauseResume$ = new BehaviorSubject<boolean>(true);
  @ViewChildren(SolicitudCardComponent)
  elements: QueryList<SolicitudCardComponent>;

  timer$ = timer(1000, 60000).pipe(
    withLatestFrom(this._pauseResume$),
    takeUntil(this.destroy$),
    filter(([time, val]) => val),
    tap(([time, val]) => this.refreshRetraso(time))
  );

  constructor(
    private service: SolicitudesService,
    private modal: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.pendientes$ = this.service.pendientesPorAutorizar$.pipe(
      takeUntil(this.destroy$)
    );

    this.timer$.subscribe(
      () => {},
      () => {},
      () => console.log('COMPLETE PULLING')
    );
  }

  private refreshRetraso(time: number) {
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

  async onAutorizar(solicitud: Partial<SolicitudDeDeposito>) {
    console.log('Autorizar: ', solicitud);
    const modal = await this.modal.create({
      component: AutorizarModalComponent,
      componentProps: { solicitud },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.autorizacion) {
      this.service.autorizar(solicitud.id, data);
    } else if (data.rechazo) {
      this.service.rechazar(solicitud.id, data.rechazo);
    }
  }

  onRechazar(solicitud: Partial<SolicitudDeDeposito>) {}
}
