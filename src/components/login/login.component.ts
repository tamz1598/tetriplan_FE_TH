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

  constructor(private authService: AuthService, private router: Router, private apiService: ApiService) {}

  async loginWithGoogle() {
    try {
      const user = await this.authService.googleSignIn();
      if (user) {
        const idToken = await user.getIdToken();
        // Send the idToken to your backend via ApiService
        this.apiService.loginWithGoogle(idToken).subscribe(
          response => {
            // Handle successful login, e.g., store the token, navigate to another route, etc.
            this.router.navigate(['/dashboard']);
          },
          error => {
            this.errorMessage = 'Backend login failed.';
            console.error('Backend login error:', error);
          }
        );
      }
    } catch (error) {
      this.errorMessage = 'Google Sign-In failed.';
      console.error('Google Sign-In Error:', error);
    }
  }
}