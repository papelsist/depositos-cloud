import { Component, OnInit } from '@angular/core';
import { AuthService } from '@papx/auth';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user$ = this.service.currentUser$;
  constructor(private service: AuthService) {}

  ngOnInit() {}
}
