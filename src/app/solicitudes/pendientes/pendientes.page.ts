import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { BehaviorSubject, Observable, timer } from 'rxjs';
import { filter, takeUntil, tap, withLatestFrom } from 'rxjs/operators';

import { SolicitudesService } from '@papx/data-access';
import { SolicitudDeDeposito } from '@papx/models';
import { BaseComponent } from 'src/app/core';
import { SolicitudCardComponent } from '@papx/shared/ui-solicitudes/solicitud-card/solicitud-card.component';

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

  constructor(private service: SolicitudesService) {
    super();
  }

  ngOnInit() {
    this.pendientes$ = this.service
      .findPendientes()
      .pipe(takeUntil(this.destroy$));

    this.timer$.subscribe(
      () => {},
      () => {},
      () => console.log('COMPLETE PULLING')
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
}
