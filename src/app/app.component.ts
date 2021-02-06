import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './@auth/auth.service';
import { Router } from '@angular/router';
import { users } from 'functions/src/catalogos/data';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) =>
      console.log('Curren user:', user?.displayName)
    );

    this.authService.userInfo$.subscribe((res) => console.log('INFO: ', res));
  }

  async signOut() {
    await this.authService.singOut();
    this.router.navigate(['/login']);
  }
}
