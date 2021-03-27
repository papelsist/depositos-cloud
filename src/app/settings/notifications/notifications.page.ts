import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';
import { UserInfo } from '@papx/models';

import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NotificationsService } from 'src/app/@data-access/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  token$ = this.service.token$;
  user$ = this.auth.userInfo$;
  vm$ = combineLatest([this.token$, this.user$]).pipe(
    map(([token, user]) => ({ token, user }))
  );

  constructor(
    private service: NotificationsService,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  autorizar(user: UserInfo) {
    this.service.requestPermission(user);
  }
  cancelar(token: string, user: UserInfo) {
    this.service.deleteToken(token, user);
  }

  tooglePendientes(token: string, { detail: { checked } }: any) {
    const topic = 'newSolicitudCreated';
    if (checked) {
      this.service.unsubscribeToTopic(token, topic);
    } else {
      this.service.subscribeToTopic(token, topic);
    }
  }
}
