import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loggedInUserName: string | null = null;

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {}

  async loginWithGoogle() {
    try {
      const user = await this.authService.googleSignIn();
      if (user) {
        const idToken = await user.getIdToken();
        const username = user.displayName || '';
        const email = user.email;
        const fullName = user.displayName || '';

        if (email) {
          // Check if user exists in the backend by email
          this.apiService.getUserByEmail(email).subscribe(
            existingUser => {
              if (existingUser) {
                // User exists, set a success message
                this.successMessage = 'User already exists. Redirecting to the dashboard...';
                // Optionally navigate to the dashboard after a short delay
                setTimeout(() => {
                  this.router.navigate(['/dashboard']);
                  this.loggedInUserName = `Hello ${fullName}`; // Set greeting with full name
                }, 2000);
              } else {
                // User does not exist, create a new user
                this.apiService.addUser({ username, email, fullName }).subscribe(
                  response => {
                    // Handle successful user creation, e.g., navigate to another route
                    this.successMessage = 'User created successfully. Redirecting to the dashboard...';
                    setTimeout(() => {
                      this.router.navigate(['/dashboard']);
                      this.loggedInUserName = `Hello ${fullName}`; // Set greeting with full name
                    }, 2000);
                  },
                  (error: any) => {
                    this.errorMessage = 'Error creating user.';
                    console.error('Error creating user:', error);
                  }
                );
              }
            },
            (error: any) => {
              this.errorMessage = 'Error checking user existence.';
              console.error('Error checking user existence:', error);
            }
          );
        } else {
          this.errorMessage = 'No email found for the Google account.';
        }
      }
    } catch (error: any) {
      this.errorMessage = 'Google Sign-In failed.';
      console.error('Google Sign-In Error:', error);
    }
  }
}