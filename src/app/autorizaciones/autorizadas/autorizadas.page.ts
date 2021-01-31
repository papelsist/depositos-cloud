import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '@papx/data-access';

@Component({
  selector: 'app-autorizadas',
  templateUrl: './autorizadas.page.html',
  styleUrls: ['./autorizadas.page.scss'],
})
export class AutorizadasPage implements OnInit {
  autorizadas$ = this.service.autorizadas$;
  constructor(private service: SolicitudesService) {}

  ngOnInit() {}
}
