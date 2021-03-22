import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../@data-access/services/notifications.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private _notificaciones = this.service.token !== null;
  nmx$ = this.service.token$.pipe(map((t) => t !== null));
  constructor(private service: NotificationsService) {}

  ngOnInit() {
    this.service.getMessages().subscribe(async (msg) => {
      console.log('On message: ', msg);
    });
  }

  get notificaciones() {
    return this._notificaciones;
  }

  set notificaciones(value: boolean) {
    value ? this.service.requestPermission() : this.service.deleteToken();
  }

  private handleError(err: any) {
    console.error('Error requesting token ', err.message);
  }
}
