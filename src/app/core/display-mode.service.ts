import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DisplayModeService {
  dark: boolean;
  isDark$ = new Subject<boolean>();
  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.dark = prefersDark.matches;
    this.toggleDarkMode(this.dark);

    prefersDark.addEventListener('change', (mediaQuery) => {
      this.dark = mediaQuery.matches;
      this.toggleDarkMode(this.dark);
    });
  }

  toggleDarkMode(isDark: boolean) {
    this.dark = isDark;
    document.body.classList.toggle('dark', this.dark);
  }
}
