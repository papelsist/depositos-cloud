import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '@papx/auth';
import { User, UserInfo } from '@papx/models';
import { combineLatest, merge } from 'rxjs';
import {
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  token: string;
  token$ = this.afm.tokenChanges.pipe(tap((token) => (this.token = token)));

  constructor(
    private afm: AngularFireMessaging,
    private firestore: AngularFirestore,
    private functions: AngularFireFunctions,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  requestPermission(user: UserInfo) {
    this.afm.requestToken.subscribe(async (token) => {
      await this.firestore.doc(`usuarios/${user.uid}`).update({ token });
      this.showToast('Dispositivo autorizado');
    });
  }

  deleteToken(token: string, user: UserInfo) {
    this.afm.deleteToken(token).subscribe(async (val) => {
      await this.firestore.doc(`usuarios/${user.uid}`).update({ token: null });
    });
  }

  subscribeToTopic(token: string, topic: string) {
    const callable = this.functions.httpsCallable('subscribeToTopic');
    callable({ token, topic }).subscribe(
      (res) => this.showToast(res),
      (err) => this.handleError(err)
    );
  }

  unsubscribeToTopic(token: string, topic: string) {
    const callable = this.functions.httpsCallable('unsubscribeToTopic');
    callable({ token, topic }).subscribe(
      (res) => this.showToast(res),
      (err) => this.handleError(err)
    );
  }

  showMessage() {
    this.afm.messages.pipe(
      tap((msg) => {
        const body: any = (msg as any).notification.body;
        this.showToast(body);
      })
    );
  }

  async showToast(message: any) {
    const toast = await this.toastController.create({
      header: 'Notificación',
      message,
      color: 'warning',
      duration: 8000,
      position: 'bottom',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  async handleError(err: any) {
    const alert = await this.alertController.create({
      header: 'Error en Firebase',
      message: err.message,
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }
}
