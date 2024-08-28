import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { filter } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent implements OnInit {
    errorMessage: string | null = null;
    successMessage: string | null = null;
    loggedInUserName: string | null = null;
    email: string = '';
    password: string = '';
    loading: boolean = false;
  
    constructor(
      private authService: AuthService,
      private router: Router,
      private apiService: ApiService,
      private renderer: Renderer2,
      private afAuth: AngularFireAuth 
    ) {}

    
  ngOnInit() {
    console.log('LoginComponent loaded');

    // Automatically sign out the user on component load
    this.afAuth.signOut().then(() => {
      console.log('User signed out automatically on component load');
      // Check current authentication state after signing out
      this.afAuth.authState.subscribe(user => {
        if (user) {
          console.log('User found in auth state:', user);
          // If a user is logged in, navigate to the dashboard
          this.navigateToDashboard();
        } else {
          // If no user is logged in, stay on the login page
          console.log('No user logged in, showing login page');
        }
      });
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  }
  
    async loginWithGoogle() {
      this.setLoading(true);
      try {
        const result = await this.authService.googleSignIn();
        const user = result.user;
        if (user) {
          const email = user.email;
          const fullName = user.displayName || '';
  
          if (email) {
            console.log('User logged in with Google:', user);
            localStorage.setItem('currentUserEmail', email);
            localStorage.setItem('currentUserFullName', fullName);
  
            await this.handleUserLogin(email, fullName);
          } else {
            this.errorMessage = 'No email found for the Google account.';
            this.setLoading(false);
          }
        }
      } catch (error) {
        this.errorMessage = 'Google Sign-In failed.';
        console.error('Google Sign-In Error:', error);
        this.setLoading(false);
      }
    }
  
    async handleUserLogin(email: string, fullName: string) {
      this.setLoading(true);
      try {
        const existingUser = await this.apiService.getUserByEmail(email).toPromise();
        if (existingUser) {
          this.successMessage = 'User already exists. Redirecting to the dashboard...';
          console.log('User already exists. Redirecting to the dashboard...');
        } else {
          await this.apiService.addUser({ username: fullName, email, fullName }).toPromise();
          this.successMessage = 'User created successfully. Redirecting to the dashboard...';
          console.log('User created successfully. Redirecting to the dashboard...');
        }
        setTimeout(() => {
          this.navigateToDashboard();
          this.loggedInUserName = `Hello ${fullName}`;
        }, 2000);
      } catch (error) {
        this.errorMessage = 'Error handling user login.';
        console.error('User Login Error, set loading false:', error);
        this.setLoading(false);
      }
    }
  
    loginWithEmail() {
      this.setLoading(true);
      this.apiService.getUsers().subscribe(
        response => {
          const users = response.users;
          if (Array.isArray(users)) {
            const userFound = users.find(user => user.email === this.email && user.password === this.password);
            if (userFound) {
              this.successMessage = 'Login successful. Redirecting to the dashboard...';
              console.log('Login successful. Redirecting to the dashboard...');
              localStorage.setItem('currentUserEmail', userFound.email);
              localStorage.setItem('currentUserFullName', userFound.fullName);
              setTimeout(() => {
                this.navigateToDashboard();
                this.loggedInUserName = `Hello ${userFound.fullName}`;
              }, 2000);
            } else {
              this.errorMessage = 'Invalid email or password. Please try again.';
              this.setLoading(false);
            }
          } else {
            this.errorMessage = 'Unexpected response format.';
            console.error('Expected an array but got:', users);
            this.setLoading(false);
          }
        },
        error => {
          this.errorMessage = 'Login failed. Please try again later.';
          console.error('Login Error:', error);
          this.setLoading(false);
        }
      );
    }
  
    setLoading(isLoading: boolean) {
      this.loading = isLoading;
      if (isLoading) {
        this.renderer.addClass(document.body, 'loading');
      } else {
        this.renderer.removeClass(document.body, 'loading');
      }
    }
  
    private navigateToDashboard() {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd && event.url === '/dashboard')
      ).subscribe(() => {
        this.setLoading(false); // Stop loading
      });
  
      this.router.navigate(['/dashboard']);
    }
  
   
  
  }