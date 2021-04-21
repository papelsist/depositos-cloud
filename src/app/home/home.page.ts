import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

  data = [];

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit() {
    // this.user$.subscribe((u) => console.log(u));
    // this.authService.currentUser$.subscribe((u) =>
    //   console.log('Firebase user: ', u)
    // );
  }
}
