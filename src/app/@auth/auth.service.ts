import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';

import { throwError, of, Observable } from 'rxjs';
import { catchError, map, shareReplay, switchMap, tap } from 'rxjs/operators';

import { User, UserInfo } from '../@models/user';
import { mapUser } from './utils';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // readonly currentUser$ = this.auth.user;
  readonly hostUrl = 'http://localhost:8100/';

  readonly currentUser$ = this.auth.user.pipe(
    map((user) => (user ? mapUser(user) : null)),
    shareReplay()
  );

  readonly claims$ = this.auth.idTokenResult.pipe(
    map((res) => (res ? res.claims : {}))
  );

  readonly userInfo$: Observable<UserInfo | null> = this.currentUser$.pipe(
    switchMap((user) => {
      return user ? this.getUserByEmail(user.email) : of(null);
    }),
    catchError((err) => throwError(err))
  );

  constructor(
    private http: HttpClient,
    public readonly auth: AngularFireAuth,
    private readonly fns: AngularFireFunctions,
    private readonly firestore: AngularFirestore
  ) {}

  async singOut() {
    await this.auth.signOut();
  }

  async signInAnonymously() {
    const { user } = await this.auth.signInAnonymously();
    return mapUser(user);
  }

  async signIn(email: string, password: string) {
    try {
      const { user } = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      return user;
    } catch (error) {
      let message = null;
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuario no registrado';
          break;
        case 'auth/wrong-password':
          message = 'Nombre de corrreo ó contraseña incorrectas';
          break;
        default:
          message = error.message;
          break;
      }
      throw new Error(message);
    }
  }

  async createUser(email: string, password: string) {
    const credentials = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );
    await credentials.user.sendEmailVerification({
      url: this.hostUrl,
      handleCodeInApp: false,
    });
    return credentials;
  }

  sendEmailVerification(user: User) {
    return user.firebaseUser.sendEmailVerification({
      url: this.hostUrl,
      handleCodeInApp: false,
    });
  }

  createSiipapUser(email: string, password: string, displayName: string) {
    const data = { email, password, displayName };
    const callable = this.fns.httpsCallable('createSiipapUser');
    return callable(data).pipe(
      map(() => this.auth.signInWithEmailAndPassword(email, password)),
      map(async (p) => {
        const d = await p;
        const user = d.user;
        await user.sendEmailVerification({
          url: this.hostUrl,
          handleCodeInApp: false,
        });
        console.log('Usuario sin veriicar Verification mail sent');
        return user;
      }),
      tap((user) => {}),
      catchError((err) => throwError(err))
    );
  }

  getUserByUid(uid: string): Observable<UserInfo | null> {
    return this.firestore
      .collection<UserInfo>('users', (ref) => {
        return ref.where('uid', '==', uid).limit(1);
      })
      .valueChanges()
      .pipe(
        map((users) => (users.length > 0 ? users[0] : null)),
        catchError((err) => throwError(err))
      );
  }

  getUserByEmail(email: string): Observable<UserInfo | null> {
    return this.firestore
      .collection<UserInfo>('users', (ref) => {
        return ref.where('email', '==', email).limit(1);
      })
      .valueChanges()
      .pipe(
        map((users) => (users.length > 0 ? users[0] : null)),
        catchError((err) => throwError(err))
      );
  }
}
