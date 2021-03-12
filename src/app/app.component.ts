import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './@auth/auth.service';
import { Router } from '@angular/router';
import { DisplayModeService } from './core/display-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user$ = this.authService.currentUser$;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private displayService: DisplayModeService
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
    // this.displayService.toggleDisplayMode();
    // this.logSecurityState();
    // this.user$.subscribe((user) => console.log('USER: ', user));
  }

  /**
   * Temporal para verificar datos de Firebase auth
   */
  private logSecurityState() {
    this.authService.currentUser$.subscribe((user) =>
      console.log(`User:${user?.displayName} Verified: ${user?.emailVerified}`)
    );
    this.authService.userInfo$.subscribe((res) =>
      console.log('Profile: ', res)
    );
    this.authService.claims$.subscribe((claims) =>
      console.log('Claims: ', claims)
    );
  }

  async signOut() {
    await this.authService.singOut();
    this.router.navigate(['/login']);
  }
}
