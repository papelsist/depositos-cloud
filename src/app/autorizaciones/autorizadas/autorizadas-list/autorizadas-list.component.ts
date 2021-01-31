import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SolicitudDeDeposito } from '@papx/models';

@Component({
  selector: 'papx-solicitudes-autorizadas-list',
  templateUrl: './autorizadas-list.component.html',
  styleUrls: ['./autorizadas-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutorizadasListComponent implements OnInit {
  @Input() solicitudes: SolicitudDeDeposito[] = [];
  constructor() {}

  ngOnInit() {}
}
