import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // Observable for authentication state
    // AngularFireAuth provides an authState observable that shows the current user’s authentication state.
    public authState$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
      // Set authState$ to the authState observable from AngularFireAuth
      // so I am modifying the guard to use 'authState' observable from 'AuthService' to check if the user logged in
      this.authState$ = this.afAuth.authState;
  }

  googleSignIn(): Promise<firebase.auth.UserCredential> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}