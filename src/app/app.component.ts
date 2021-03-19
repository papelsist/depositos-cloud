import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';

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
    private authService: AuthService,
    private router: Router,
    private displayService: DisplayModeService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.displayService.startDarkMode();
  }

  ngOnInit() {
    // this.logSecurityState();
  }

  /**
   * Temporal para verificar datos de Firebase auth
   */
  private logSecurityState() {
    this.authService.currentUser$.subscribe((user) =>
      console.log(`User:${user?.displayName} Verified: ${user?.emailVerified}`)
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
