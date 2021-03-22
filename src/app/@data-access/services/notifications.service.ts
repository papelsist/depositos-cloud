import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ToastController } from '@ionic/angular';
import { mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  token: string;
  token$ = this.afm.getToken;

  constructor(
    private afm: AngularFireMessaging,
    private toast: ToastController
  ) {
    afm.getToken.subscribe((t) => {
      this.token = t;
    });
  }

  requestToken() {
    return this.afm.requestToken;
  }
  requestPermission() {
    this.afm.requestToken.subscribe((token) =>
      console.log('Permission granted token: ', token)
    );
  }

  getMessages() {
    return this.afm.messages;
  }

  deleteToken() {
    this.afm.getToken
      .pipe(
        mergeMap((token) => {
          console.log('Deleting token: ', token);
          this.token = null;
          return this.afm.deleteToken(token);
        })
      )
      .subscribe((token) => console.log('Token deleted'));
  }

  showMessage(message: any) {
    console.log('Message: ', message);
  }
}
