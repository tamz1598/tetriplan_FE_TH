import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {}

  //google-signIn pop-up window of google authentication to appear.
  //catch an error signing in.

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const credential = await this.afAuth.signInWithPopup(provider);
      return credential.user;
    } catch (error) {
      console.error("Google Sign-In Error: ", error);
      return null;
    }
  }

  async signOut() {
    await this.afAuth.signOut();
  }
}