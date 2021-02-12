import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitudes-list-view',
  template: ` <ion-grid class="ion-no-padding">
    <ion-row>
      <ion-col size="12" size-xl="10" offset-xl="1">
        <ion-list class="ion-no-padding" lines="full">
          <papx-solicitud-list-item
            [delegateDrilldown]="delegateDrilldown"
            [sol]="sol"
            *ngFor="let sol of solicitudes"
            (selection)="selection.emit(sol)"
          >
          </papx-solicitud-list-item>
        </ion-list>
      </ion-col>
    </ion-row>
  </ion-grid>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudesListViewComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[];
  @Output() selection = new EventEmitter();
  @Input() delegateDrilldown = false;
  constructor() {}

  ngOnInit() {}
}
