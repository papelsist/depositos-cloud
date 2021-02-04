import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';

import { BehaviorSubject, throwError } from 'rxjs';

import firebase from 'firebase/app';
import { User } from '../@models/user';
import { mapUser } from './utils';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser$ = this.auth.user.pipe(map(mapUser));

  constructor(
    private http: HttpClient,
    private readonly auth: AngularFireAuth,
    private fns: AngularFireFunctions
  ) {}

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
          message = 'Credenciales invalidas';
          break;
        default:
          message = error.message;
          break;
      }
      // console.error('SIGN IN ERROR: ', message);
      throw new Error(message);

      // throw new Error(`Cant sign in  Error: ${ex}`);
    }
  }

  async createUser(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  createSiipapUser(email: string, password: string) {
    const data = { email, password };
    const callable = this.fns.httpsCallable('createSiipapUser');
    return callable(data).pipe(catchError((err) => throwError(err)));
  }
}
