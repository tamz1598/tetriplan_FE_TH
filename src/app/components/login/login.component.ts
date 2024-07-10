import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { filter } from 'rxjs/operators';

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
      private renderer: Renderer2
    ) {}
  
    async loginWithGoogle() {
      this.setLoading(true);
      //user is object
      try {
        const result = await this.authService.googleSignIn();
        const user = result.user;
        if (user) {
          const email = user.email;
          const fullName = user.displayName || '';

          // ensure email is not null other null will be sent here
          if (email) {
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
      try {
        const existingUser = await this.apiService.getUserByEmail(email).toPromise();
        if (existingUser) {
          this.successMessage = 'User already exists. Redirecting to the dashboard...';
        } else {
          await this.apiService.addUser({ username: fullName, email, fullName }).toPromise();
          this.successMessage = 'User created successfully. Redirecting to the dashboard...';
        }
        setTimeout(() => {
          this.navigateToDashboard();
          this.loggedInUserName = `Hello ${fullName}`;
        }, 2000);
      } catch (error) {
        this.errorMessage = 'Error handling user login.';
        console.error('User Login Error:', error);
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
      // Subscribe to NavigationEnd event to stop loading indicator after dashboard component is loaded
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd && event.url === '/dashboard')
      ).subscribe(() => {
        this.setLoading(false); // Stop loading
      });
  
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
  
    ngOnInit() {
      console.log('LoginComponent loaded');
    }
  }