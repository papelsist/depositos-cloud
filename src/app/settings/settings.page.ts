import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';
import { UserInfo } from '@papx/models';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationsService } from '../@data-access/services/notifications.service';

@Component({
  selector: 'papx-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  vm$ = combineLatest([
    this.notificationService.token$,
    this.auth.userInfo$,
    this.auth.claims$,
  ]).pipe(map(([token, user, claims]) => ({ token, user, claims })));

  constructor(
    private auth: AuthService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit() {}

  autorizarNotificaciones(config: any) {
    const { user, claims } = config;
    this.notificationService.enableNotifications(user, claims);
  }

  cancelarNotificaciones(config: any) {
    const { token, user, claims } = config;
    this.notificationService.disableNotifications(user, claims);
  }

  testTokenMessage(token: string) {
    this.notificationService.sendTestTokenMessage(token);
  }
}
