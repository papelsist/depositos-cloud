import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';
import { SolicitudesService } from '@papx/data-access';
import { SolicitudDeDeposito, UserInfo } from '@papx/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core';

@Component({
  selector: 'app-autorizadas',
  templateUrl: './autorizadas.page.html',
  styleUrls: ['./autorizadas.page.scss'],
})
export class AutorizadasPage extends BaseComponent implements OnInit {
  solicitudes$: Observable<SolicitudDeDeposito[]>;
  user: UserInfo;
  config: { view: 'cards' | 'list'; filtrar: string } = this.loadConfig();
  filtrarPropias = false;
  filtrar$ = new BehaviorSubject<boolean>(this.config.filtrar === 'true');
  filtroBtnColor$: Observable<string> = this.filtrar$.pipe(
    map((value) => (value ? 'primary' : ''))
  );
  STORAGE_KEY = 'sx-depositos-pwa.solicitudes.autorizadas';

  constructor(private service: SolicitudesService, private auth: AuthService) {
    super();
  }

  ngOnInit() {
    this.auth.userInfo$.pipe(takeUntil(this.destroy$)).subscribe((info) => {
      this.user = info;
      this.load(this.user.sucursal);
    });
  }

  private load(sucursal: string) {
    this.solicitudes$ = this.service.findPorSucursal(sucursal, 'AUTORIZADO');
  }

  private loadConfig(): any {
    const sjson = localStorage.getItem(this.STORAGE_KEY);
    return sjson ? JSON.parse(sjson) : { view: 'cards', filtrar: 'false' };
  }

  private saveConfig() {
    const sjson = JSON.stringify(this.config);
    localStorage.setItem(this.STORAGE_KEY, sjson);
  }
  filtrar() {
    this.filtrarPropias = !this.filtrarPropias;
    this.filtrar$.next(this.filtrarPropias);
    this.config.filtrar = this.filtrarPropias.toString();
    this.saveConfig();
  }
}
