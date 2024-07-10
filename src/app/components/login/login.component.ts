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

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService, private renderer: Renderer2) {}


  async loginWithGoogle() {
    this.setLoading(true);
      try {
          const result = await this.authService.googleSignIn();
          const user = result.user;
          if (user) {
              const email = user.email;
              const username = user.displayName || '';
              const fullName = user.displayName || '';

              if (email) {
                  this.apiService.getUserByEmail(email).subscribe(
                      existingUser => {
                          if (existingUser) {
                              this.successMessage = 'User already exists. Redirecting to the dashboard...';
                              console.log('Navigating to /dashboard');
                              setTimeout(() => {
                                  this.navigateToDashboard();
                                  this.loggedInUserName = `Hello ${fullName}`;
                                  
                              }, 2000);
                          } else {
                              this.apiService.addUser({ username, email, fullName }).subscribe(
                                  response => {
                                      this.successMessage = 'User created successfully. Redirecting to the dashboard...';
                                      setTimeout(() => {
                                          this.navigateToDashboard();
                                          this.loggedInUserName = `Hello ${fullName}`;
                                         
                                      }, 2000);
                                  },
                                  error => {
                                      this.errorMessage = 'Error creating user.';
                                      console.error('Error creating user:', error);
                                      
                                  }
                              );
                          }
                      },
                      error => {
                          this.errorMessage = 'Error checking user existence.';
                          console.error('Error checking user existence:', error);
                          
                      }
                  );
              } else {
                  this.errorMessage = 'No email found for the Google account.';
                 
              }
          }
      } catch (error) {
          this.errorMessage = 'Google Sign-In failed.';
          console.error('Google Sign-In Error:', error);
      
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
                      setTimeout(() => {
                          this.navigateToDashboard();
                          this.loggedInUserName = `Hello ${userFound.fullName}`;
                         
                      }, 2000);
                  } else {
                      this.errorMessage = 'Invalid email or password. Please try again.';
                     
                  }
              } else {
                  this.errorMessage = 'Unexpected response format.';
                  console.error('Expected an array but got:', users);
                
              }
          },
          error => {
              this.errorMessage = 'Login failed. Please try again later.';
              console.error('Login Error:', error);
             
          }
      );
  }

  //toggle loading icon
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