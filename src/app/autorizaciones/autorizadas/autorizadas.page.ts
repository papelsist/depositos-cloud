import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '@papx/data-access';
import { BehaviorSubject, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-autorizadas',
  templateUrl: './autorizadas.page.html',
  styleUrls: ['./autorizadas.page.scss'],
})
export class AutorizadasPage implements OnInit {
  private _searchTerm = new BehaviorSubject('');
  seartTerm$ = this._searchTerm.asObservable();
  autorizadas$ = this.service.autorizadas$;
  filter = null;

  filteredList$ = this.seartTerm$.pipe(
    withLatestFrom(this.autorizadas$),
    map(([term, rows]) => {
      console.log('Term: ', !term);
      console.log('Term !!: ', !!term);
      if (!term || term.length === 0) {
        return rows;
      } else {
        return rows.filter((item) => {
          const crit = `${item.folio.toString().toLowerCase()}`;
          return crit.includes(term);
        });
      }
    })
  );
  constructor(private service: SolicitudesService) {}

  ngOnInit() {
    // this.filteredList$.subscribe((rows) => console.log('Rows: ', rows));
  }

  onSearch(event: any) {
    if (!!event) {
      this.filter = event;
    } else {
      this.filter = null;
    }

    this.filter
      ? (this.autorizadas$ = this.service.buscarAutorizadas(this.filter))
      : (this.autorizadas$ = this.service.autorizadas$);
  }

  onFilter({ detail: { value } }: any) {
    this._searchTerm.next(value);
  }
}
