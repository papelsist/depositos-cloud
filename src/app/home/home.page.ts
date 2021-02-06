import { Component, OnInit } from '@angular/core';
import { AuthService } from '../@auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user$ = this.authService.currentUser$;
  constructor(private authService: AuthService) {}

  ngOnInit() {}
}
