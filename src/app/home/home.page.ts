import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../@auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user$ = this.authService.currentUser$;
  verified$ = this.user$.pipe(map((user) => user.emailVerified));

  constructor(private authService: AuthService) {}

  ngOnInit() {}
}
