import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import * as CryptoJS from 'crypto-js'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    errorMessage: string | null = null;
    successMessage: string | null = null;
    failedMessage: string | null = null;
    loggedInUserName: string | null = null;
    email: string = '';
    password: string = '';
  
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
  
    
    loginWithEmail() {
        // Hash the password before sending it to the backend using crypto-js
        // const hashedPassword = CryptoJS.SHA256(this.password).toString(CryptoJS.enc.Base64); 
        // Convert hash to Base64 string
    
        // Send login request to backend
        this.apiService.getUsers().subscribe(
            (response: any) => {
              console.log('Response from getUsers:', response);
        
              const users = response.users;
        
              // Check if users is now an array since response was an object
              if (Array.isArray(users)) {
                console.log('Users is an array:', users);
        
                // Find the user by email and password
                const userFound = users.find(user => user.email === this.email && user.password === this.password);
                console.log('User found:', userFound);
        
                if (userFound) {
                  this.successMessage = 'Login successful. Redirecting to the dashboard...';
                  setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                    this.loggedInUserName = `Hello ${userFound.fullName}`; // Display user's full name
                  }, 2000);
                } else {
                  this.errorMessage = 'Invalid email or password. Please try again.';
                }
              } else {
                this.failedMessage = 'Users response is not an array';
                console.error('Expected an array but got:', users);
              }
            },
            (error: any) => {
              this.errorMessage = 'Login failed. Please try again later.';
              console.error('Login Error:', error);
            }
          );
      }
    ngOnInit() {
      console.log('LoginComponent loaded');
    }  
}